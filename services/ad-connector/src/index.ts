import ldap from "ldapjs";

const config = {
  url: process.env.AD_URL,
  baseDn: process.env.AD_BASE_DN,
  bindDn: process.env.AD_BIND_DN,
  bindPassword: process.env.AD_BIND_PASSWORD,
  apiUrl: process.env.AD_CNT_API_URL,
  syncToken: process.env.AD_CNT_SYNC_TOKEN,
};

for (const [name, value] of Object.entries(config)) {
  if (!value) throw new Error(`Missing environment variable for ${name}`);
}

const url = new URL(config.url!);

function client() {
  return ldap.createClient({
    url: config.url!,
    timeout: 10000,
    connectTimeout: 10000,
    tlsOptions: url.protocol === "ldaps:" ? { minVersion: "TLSv1.2" } : undefined,
  });
}

type DirectoryUser = {
  username: string;
  displayName: string;
  email: string | null;
  enabled: boolean;
  department: string | null;
};

async function readUsers(): Promise<DirectoryUser[]> {
  const c = client();
  try {
    await new Promise<void>((resolve, reject) => {
      c.bind(config.bindDn!, config.bindPassword!, (error) => error ? reject(error) : resolve());
    });

    return await new Promise<DirectoryUser[]>((resolve, reject) => {
      const users: DirectoryUser[] = [];
      c.search(config.baseDn!, {
        scope: "sub",
        filter: "(&(objectCategory=person)(objectClass=user))",
        attributes: ["sAMAccountName", "displayName", "mail", "userAccountControl", "department"],
        paged: { pageSize: 500, pagePause: false },
      }, (error, response) => {
        if (error) return reject(error);
        response.on("searchEntry", (entry) => {
          const obj = entry.pojo.attributes.reduce<Record<string, unknown>>((acc, attr) => {
            acc[attr.type] = attr.values.length === 1 ? attr.values[0] : attr.values;
            return acc;
          }, {});
          const control = Number(obj.userAccountControl ?? 0);
          users.push({
            username: String(obj.sAMAccountName ?? ""),
            displayName: String(obj.displayName ?? obj.sAMAccountName ?? ""),
            email: obj.mail ? String(obj.mail) : null,
            enabled: (control & 2) === 0,
            department: obj.department ? String(obj.department) : null,
          });
        });
        response.on("error", reject);
        response.on("end", () => resolve(users.filter((u) => u.username)));
      });
    });
  } finally {
    c.unbind();
  }
}

async function sync() {
  const users = await readUsers();
  const response = await fetch(config.apiUrl!, {
    method: "POST",
    headers: { "content-type": "application/json", "x-ad-sync-token": config.syncToken! },
    body: JSON.stringify({ users }),
  });
  if (!response.ok) throw new Error(`AD-CNT sync failed with HTTP ${response.status}`);
  console.log(`Synchronized ${users.length} directory users.`);
}

sync().catch((error) => {
  console.error("AD sync failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
