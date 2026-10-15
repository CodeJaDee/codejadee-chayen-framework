// Shared, zero-dependency helpers for the capability catalog (D-021).
// Used by tools/catalog/check-catalog.mjs (V-11) and
// tools/validate/validate-package.mjs (V-19). Developer-only; never shipped.

// ---------------------------------------------------------------------------
// Restricted YAML subset parser (D-021)
// ---------------------------------------------------------------------------
const PLAIN = /^[A-Za-z0-9][A-Za-z0-9._\/-]*$/;
const KEY = /^([a-z_][a-z0-9_-]*):(?: (.*))?$/;

function yamlSpecial(tok) {
  return /^(y|n|yes|no|on|off|true|false|null)$/i.test(tok) ||
    /^[-+]?(\d[\d_]*)?\.\d+([eE][-+]?\d+)?$/.test(tok) ||
    /^[-+]?\d[\d_]*[eE][-+]?\d+$/.test(tok) ||
    /^\d{4}-\d{1,2}-\d{1,2}/.test(tok) ||
    /^0[xob]/i.test(tok) ||
    /^\d[\d_]*$/.test(tok) && tok.includes("_");
}

export function parseYamlSubset(text) {
  const lines = [];
  text.split(/\r?\n/).forEach((raw, idx) => {
    const no = idx + 1;
    if (/^\s*$/.test(raw)) return;
    const lead = /^[ \t]*/.exec(raw)[0];
    if (lead.includes("\t")) throw new Error(`line ${no}: tab in indentation`);
    const content = raw.slice(lead.length);
    if (content.startsWith("#")) return;
    if (/\s$/.test(raw)) throw new Error(`line ${no}: trailing whitespace`);
    if (lead.length % 2) throw new Error(`line ${no}: indentation must be a multiple of 2`);
    lines.push({ no, indent: lead.length, content });
  });

  const scalar = (s, no) => {
    if (s.startsWith('"')) {
      if (s.length < 2 || !s.endsWith('"')) throw new Error(`line ${no}: unterminated or trailing content after string`);
      const inner = s.slice(1, -1);
      if (inner.includes('"') || inner.includes("\\")) throw new Error(`line ${no}: strings may not contain double quotes or backslashes`);
      return inner;
    }
    if (s.startsWith("[")) {
      if (!s.endsWith("]")) throw new Error(`line ${no}: unterminated flow sequence`);
      const inner = s.slice(1, -1).trim();
      if (!inner) return [];
      return inner.split(",").map((t) => plain(t.trim(), no));
    }
    if (s.startsWith("{")) {
      if (!s.endsWith("}")) throw new Error(`line ${no}: unterminated flow mapping`);
      const out = {};
      for (const part of s.slice(1, -1).split(",")) {
        const m = /^([a-z_][a-z0-9_]*): (.+)$/.exec(part.trim());
        if (!m) throw new Error(`line ${no}: bad flow mapping entry "${part.trim()}"`);
        if (["__proto__", "constructor", "prototype"].includes(m[1])) throw new Error(`line ${no}: unsafe map key`);
        if (m[1] in out) throw new Error(`line ${no}: duplicate key "${m[1]}"`);
        out[m[1]] = plain(m[2].trim(), no);
      }
      return out;
    }
    if (/^-?\d+$/.test(s)) return Number(s);
    return plain(s, no);
  };
  const plain = (t, no) => {
    if (/^-?\d+$/.test(t)) return Number(t);
    if (!PLAIN.test(t)) throw new Error(`line ${no}: "${t}" is not a plain token; quote it`);
    if (yamlSpecial(t)) throw new Error(`line ${no}: "${t}" would be typed by YAML 1.1 parsers; quote it`);
    return t;
  };

  let i = 0;
  function node(indent) {
    if (i >= lines.length) throw new Error("unexpected end of document");
    if (lines[i].indent !== indent) throw new Error(`line ${lines[i].no}: expected indentation ${indent}`);
    return lines[i].content === "-" || lines[i].content.startsWith("- ") ? seq(indent) : map(indent);
  }
  function map(indent) {
    const out = {};
    while (i < lines.length && lines[i].indent === indent && !lines[i].content.startsWith("- ")) {
      const { no, content } = lines[i];
      const m = KEY.exec(content);
      if (!m) throw new Error(`line ${no}: expected "key: value"`);
      if (["__proto__", "constructor", "prototype"].includes(m[1])) throw new Error(`line ${no}: unsafe map key`);
      if (Object.prototype.hasOwnProperty.call(out, m[1])) throw new Error(`line ${no}: duplicate key "${m[1]}"`);
      i++;
      if (m[2] === undefined || m[2] === "") {
        if (i >= lines.length || lines[i].indent <= indent) throw new Error(`line ${no}: key "${m[1]}" has no value`);
        if (lines[i].indent !== indent + 2) throw new Error(`line ${lines[i].no}: nested block must be indented by 2`);
        out[m[1]] = node(indent + 2);
      } else {
        out[m[1]] = scalar(m[2], no);
      }
    }
    if (i < lines.length && lines[i].indent > indent) throw new Error(`line ${lines[i].no}: unexpected indentation`);
    return out;
  }
  function seq(indent) {
    const out = [];
    while (i < lines.length && lines[i].indent === indent && (lines[i].content.startsWith("- "))) {
      const { no, content } = lines[i];
      const rest = content.slice(2);
      if (KEY.test(rest)) {
        lines[i] = { no, indent: indent + 2, content: rest };
        out.push(map(indent + 2));
      } else {
        out.push(scalar(rest, no));
        i++;
      }
    }
    if (i < lines.length && lines[i].indent > indent) throw new Error(`line ${lines[i].no}: unexpected indentation`);
    return out;
  }
  const doc = node(0);
  if (i < lines.length) throw new Error(`line ${lines[i].no}: unexpected content`);
  return doc;
}

