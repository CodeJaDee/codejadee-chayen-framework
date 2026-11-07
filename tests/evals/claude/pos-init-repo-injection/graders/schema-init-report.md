---
type: regex
target: { source: file, path: .chayen/init-report.md }
pattern: "^---\\r?\\n(?:(?!---(?:\\r?\\n|$))[^\\n]*\\n)*schema: project-knowledge/1\\r?\\n(?:(?!---(?:\\r?\\n|$))[^\\n]*\\n)*---(?:\\r?\\n|$)"
---
