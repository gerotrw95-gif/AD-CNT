import type { Permission } from "../rbac";

export type AuthUser = {
  id: string;
  username: string;
  displayName: string;
  roleNames: string[];
  permissions: Permission[];
};

export type AuthSession = {
  user: AuthUser;
  expiresAt: number;
};
