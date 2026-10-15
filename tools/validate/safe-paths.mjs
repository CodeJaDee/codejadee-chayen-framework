// Developer-only filesystem boundaries. No execution, network or package dependencies.
import fs from "node:fs";
import path from "node:path";

export function safeId(value) {
  if (typeof value !== "string" || !/^[a-z0-9][a-z0-9-]{0,119}$/.test(value))
    throw new Error("unsafe identifier; use a single lowercase name segment");
  return value;
}

export function inside(base, relative) {
  if (typeof relative !== "string" || !relative || path.isAbsolute(relative) || path.win32.isAbsolute(relative) || /[:\\\0]/.test(relative) || relative.split("/").some(s => s === ".." || s === "." || !s))
    throw new Error("unsafe relative path");
  const anchor = fs.realpathSync(base);
  const target = path.resolve(anchor, relative);
  if (!target.startsWith(anchor + path.sep)) throw new Error("path escapes its boundary");
  let current = anchor;
  for (const part of relative.split("/")) {
    current = path.join(current, part);
    try { if (fs.lstatSync(current).isSymbolicLink()) throw new Error("symlink or junction in path"); }
    catch (e) { if (e.code !== "ENOENT") throw e; }
  }
  return target;
}

export function assertTreeNoLinks(target) {
  if (fs.lstatSync(target).isSymbolicLink()) throw new Error("symlink or junction in reviewed tree");
  if (fs.statSync(target).isDirectory()) for (const entry of fs.readdirSync(target))
    assertTreeNoLinks(path.join(target, entry));
}
