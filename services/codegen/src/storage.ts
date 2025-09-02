import fs from "fs-extra";
import path from "path";

export interface StoredObject { key: string; url: string; }

const provider = process.env.STORAGE_PROVIDER || "local";
const localRoot = path.resolve(process.cwd(), "../../artifacts");

export async function putObject(key: string, filePath: string): Promise<StoredObject> {
  if (provider === "local") {
    const dest = path.join(localRoot, key);
    await fs.ensureDir(path.dirname(dest));
    await fs.copy(filePath, dest);
    return { key, url: dest };
  }
  throw new Error("Non-local storage not implemented in dev");
}
