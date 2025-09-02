import fs from "fs-extra";
import path from "path";
import os from "os";
import archiver from "archiver";

export async function generateWebApp(spec: any) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "caps-web-"));
  const appDir = path.join(tmpDir, spec.meta?.name?.toLowerCase().replace(/\s+/g, "-") || "app");
  await fs.ensureDir(appDir);
  await fs.writeFile(path.join(appDir, "README.md"), `# ${spec.meta?.name || "App"}`);
  await fs.ensureDir(path.join(appDir, "pages"));
  await fs.writeFile(path.join(appDir, "pages/index.tsx"), `export default function Home(){return <div>${spec.meta?.description || "Hello"}</div>}`);

  const zipPath = path.join(tmpDir, `${path.basename(appDir)}.zip`);
  await zipFolder(appDir, zipPath);
  return { appDir, zipPath };
}

async function zipFolder(src: string, destZip: string) {
  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(destZip);
    const archive = archiver("zip", { zlib: { level: 9 } });
    output.on("close", () => resolve());
    archive.on("error", (err) => reject(err));
    archive.pipe(output);
    archive.directory(src, false);
    archive.finalize();
  });
}
