---
type: regex
match: not_contains
pattern: "uppercase\\s+tracking-(?:wide|wider|widest)|tracking-(?:wide|wider|widest)\\s+uppercase|font-(?:extrabold|black)"
target: { source: file, path: src/pages/Dashboard.jsx }
---
