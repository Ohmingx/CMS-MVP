import fs from "fs";
import path from "path";

const root = process.cwd();
const distDir = path.join(root, "frontend", "dist");
const targetDir = path.join(root, "backend", "public");

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

if (!fs.existsSync(distDir)) {
  console.error("frontend/dist not found. Run frontend build first.");
  process.exit(1);
}

fs.rmSync(targetDir, { recursive: true, force: true });
copyRecursive(distDir, targetDir);

console.log(`Synced frontend bundle to ${path.relative(root, targetDir)}`);
