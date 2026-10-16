import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
async function walk(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    result.push(...(entry.isDirectory() ? await walk(p) : [p]));
  }
  return result;
}
const sourceFiles = (await Promise.all(["app", "components", "data"].map(walk)))
  .flat()
  .filter((p) => /\.tsx?$/.test(p));
const source = (
  await Promise.all(sourceFiles.map((p) => readFile(p, "utf8")))
).join("\n");
const refs = [
  ...new Set(
    [...source.matchAll(/["'](\/(?:projects|logo)\/[^"']+)["']/g)].map(
      (m) => m[1],
    ),
  ),
];
for (const ref of refs) {
  const file = path.join("public", ref);
  if (!(await stat(file)).size) throw new Error(`Empty asset: ${file}`);
  await sharp(file).metadata();
}
for (const file of await walk("public"))
  if (!(await stat(file)).size) throw new Error(`Empty public file: ${file}`);
console.log(
  `Validated ${refs.length} referenced images and all public files are non-empty.`,
);
