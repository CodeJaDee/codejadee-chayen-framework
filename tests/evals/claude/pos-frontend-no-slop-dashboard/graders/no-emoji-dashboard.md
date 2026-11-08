---
type: regex
match: not_contains
pattern: "[\\uD83C-\\uD83E][\\uDC00-\\uDFFF]|[\\u2600-\\u27BF]"
target: { source: file, path: src/pages/Dashboard.jsx }
---
