import "server-only";

import { randomUUID } from "node:crypto";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);

export function validateUpload(file: { type: string; size: number }) {
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("UNSUPPORTED_FILE_TYPE");
  if (file.size <= 0 || file.size > MAX_FILE_SIZE) throw new Error("FILE_TOO_LARGE");
}

export function createStorageKey(category: "work-report" | "asset" | "calibration", fileName: string) {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
  return `${category}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeName}`;
}
