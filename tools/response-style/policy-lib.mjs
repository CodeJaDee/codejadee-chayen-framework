// Developer-only helpers for the opt-in response style policy (Step 39).
// Pure functions over text: no file writes, network, process spawning or provider calls.
// They implement the detection and planning rules documented in docs/RESPONSE_STYLE.md so
// the rules can be tested against disposable fixtures. Zero dependencies. Never shipped.

import fs from "node:fs";
import path from "node:path";

export const POLICY_ID = "chayen-response-style";
export const POLICY_REL = "response-style/chayen-response-style.md";
export const COPILOT_TEMPLATE_REL = "response-style/chayen-response-style.instructions.md";
export const COPILOT_FRONTMATTER = '---\napplyTo: "**"\n---\n';
const BEGIN = /^<!-- BEGIN chayen-response-style v(\d+) -->$/;
const END = /^<!-- END chayen-response-style v(\d+) -->$/;
// Lines outside the block that may set language, tone or format. Reported for human review only.
const OVERLAP = /\b(?:respond|reply|answer|write)\b[^\n]*\b(?:in|using)\s+(?:thai|english)\b|\b(?:tone|emoji|verbose|concise|wording|writing style|response style|language)\b|ภาษาไทย|ภาษาอังกฤษ|ตอบเป็น|น้ำเสียง/i;

export function loadPolicy(root) {
  const text = fs.readFileSync(path.join(root, POLICY_REL), "utf8").replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  const begin = BEGIN.exec(lines[0]), end = END.exec(lines.at(-2) ?? "");
  if (!begin || !end || lines.at(-1) !== "" || begin[1] !== end[1]) throw new Error(`${POLICY_REL} must be exactly one marked block ending with a newline`);
  return { text, version: Number(begin[1]), body: lines.slice(1, -2).join("\n") };
}

export function copilotTemplate(policy) {
  return COPILOT_FRONTMATTER + policy.text;
}

const eolOf = (text) => (/\r\n/.test(text) ? "\r\n" : "\n");
const toLines = (text) => text.replace(/\r\n/g, "\n").split("\n");

// Inspect one instruction file's text (null when the file does not exist).
export function inspect(text, policy) {
  if (text === null) return { state: "missing-file", blocks: [], overlap: [], unmarkedCopy: false };
  const lines = toLines(text), blocks = [], problems = [];
  let open = null;
  lines.forEach((line, i) => {
    const b = BEGIN.exec(line), e = END.exec(line);
    if (b) {
      if (open) problems.push(`line ${i + 1}: BEGIN inside an open block`);
      open = { start: i, version: Number(b[1]) };
    } else if (e) {
      if (!open) problems.push(`line ${i + 1}: END without BEGIN`);
      else if (Number(e[1]) !== open.version) problems.push(`line ${i + 1}: END v${e[1]} closes BEGIN v${open.version}`);
      else blocks.push({ ...open, end: i, body: lines.slice(open.start + 1, i).join("\n") });
      open = null;
    }
  });
  if (open) problems.push(`line ${open.start + 1}: BEGIN without END`);
  const inBlock = (i) => blocks.some((b) => i >= b.start && i <= b.end);
  const overlap = lines.flatMap((l, i) => (!inBlock(i) && OVERLAP.test(l) ? [{ line: i + 1, text: l.trim().slice(0, 100) }] : []));
  const signature = policy.body.split("\n").find((l) => l.length > 40);
  const unmarkedCopy = lines.some((l, i) => !inBlock(i) && l === signature);
  let state;
  if (problems.length) state = "malformed";
  else if (blocks.length > 1) state = "duplicate";
  else if (!blocks.length) state = "absent";
  else if (blocks[0].version < policy.version) state = "outdated";
  else if (blocks[0].version > policy.version) state = "newer";
  else state = blocks[0].body === policy.body ? "current" : "modified";
  return { state, blocks, problems, overlap, unmarkedCopy };
}

// Plan adding (or updating) the block. Returns { action, next } or { action: "refuse", reason }.
// Existing bytes outside the block, including line endings, are preserved.
export function planAdd(text, policy, { format = "block" } = {}) {
  const content = format === "copilot-instructions" ? copilotTemplate(policy) : policy.text;
  const r = inspect(text, policy);
  if (r.unmarkedCopy) return { action: "refuse", reason: "an unmarked copy of the policy is already present; remove it by hand first", inspection: r };
  if (r.state === "missing-file") return { action: "create", next: content, inspection: r };
  if (format === "copilot-instructions") {
    if (text.replace(/\r\n/g, "\n") === content) return { action: "none", next: text, inspection: r };
    if (r.state === "outdated" && text.replace(/\r\n/g, "\n") === COPILOT_FRONTMATTER + blockText(text, r.blocks[0])) return { action: "update", next: convert(content, eolOf(text)), inspection: r };
    return { action: "refuse", reason: "dedicated file already exists with other content; choose another file name or review it by hand", inspection: r };
  }
  if (r.state === "current") return { action: "none", next: text, inspection: r };
  if (r.state === "absent") {
    const eol = eolOf(text);
    const sep = text === "" ? "" : text.endsWith("\n") ? eol : eol + eol;
    return { action: "append", next: text + sep + convert(content, eol), inspection: r };
  }
  if (r.state === "outdated") return { action: "update", next: replaceBlock(text, r.blocks[0], convert(content.replace(/\n$/, ""), eolOf(text))), inspection: r };
  const reason = { modified: "the block was edited locally; compare it with the canonical policy by hand", newer: "the file has a newer policy version than this checkout", duplicate: "more than one block; keep one by hand", malformed: `unbalanced markers (${r.problems.join("; ")})` }[r.state];
  return { action: "refuse", reason, inspection: r };
}

// Plan removing exactly one well-formed block plus the single blank separator line before it.
export function planRemove(text, policy, { format = "block" } = {}) {
  const r = inspect(text, policy);
  if (r.state === "missing-file" || r.state === "absent") return { action: "none", next: text, inspection: r };
  if (r.state === "malformed" || r.state === "duplicate") return { action: "refuse", reason: r.state === "duplicate" ? "more than one block; remove by hand" : `unbalanced markers (${r.problems.join("; ")})`, inspection: r };
  if (format === "copilot-instructions") {
    const rest = removeBlock(text, r.blocks[0]).replace(/\r\n/g, "\n");
    if (rest === COPILOT_FRONTMATTER || rest === "") return { action: "delete-file", next: null, inspection: r };
    return { action: "refuse", reason: "the dedicated file contains other content; remove the block by hand", inspection: r };
  }
  const next = removeBlock(text, r.blocks[0]);
  return { action: next === "" ? "delete-file" : "remove", next: next === "" ? null : next, inspection: r };
}

function convert(content, eol) {
  return eol === "\n" ? content : content.replace(/\n/g, eol);
}
function rawLines(text) {
  return text.split(/(?<=\n)/);
}
function blockText(text, block) {
  return rawLines(text).slice(block.start, block.end + 1).join("").replace(/\r\n/g, "\n");
}
function replaceBlock(text, block, replacement) {
  const raw = rawLines(text);
  const last = raw[block.end];
  const lineEnd = last.endsWith("\r\n") ? "\r\n" : last.endsWith("\n") ? "\n" : "";
  return raw.slice(0, block.start).join("") + replacement + lineEnd + raw.slice(block.end + 1).join("");
}
function removeBlock(text, block) {
  const raw = rawLines(text);
  let start = block.start;
  if (start > 0 && /^\r?\n$/.test(raw[start - 1])) start--;
  let before = raw.slice(0, start).join("");
  const after = raw.slice(block.end + 1).join("");
  // A block that was the last line without a trailing newline: drop the newline that separated it.
  if (!after && !raw[block.end].endsWith("\n") && start === block.start) before = before.replace(/\r?\n$/, "");
  return before + after;
}

// Minimal one-hunk unified diff: plans change exactly one contiguous region.
export function diff(oldText, newText, label) {
  const split = (t) => (t === null || t === "" ? [] : toLines(t.replace(/\r?\n$/, "")));
  const a = split(oldText), b = split(newText);
  let p = 0;
  while (p < a.length && p < b.length && a[p] === b[p]) p++;
  let s = 0;
  while (s < a.length - p && s < b.length - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
  const removed = a.slice(p, a.length - s), added = b.slice(p, b.length - s);
  if (!removed.length && !added.length) return "";
  return [`--- ${oldText === null ? "/dev/null" : label}`, `+++ ${newText === null ? "/dev/null" : label}`, `@@ -${removed.length ? p + 1 : p},${removed.length} +${added.length ? p + 1 : p},${added.length} @@`, ...removed.map((l) => `-${l}`), ...added.map((l) => `+${l}`)].join("\n");
}
