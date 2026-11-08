#!/usr/bin/env bash
set -eu
# Generated developer-only fixture. Run only in the eval's empty workspace.
node --input-type=module <<'UI_FIXTURE'
import fs from 'node:fs';
import path from 'node:path';
const files = {
  "README.md": "# Tallybook\nInvoicing and cash tracking for small accounting practices.\nReact 18 + Tailwind CSS 3, built with Vite. Pages live in src/pages/.\n",
  "package.json": "{\n  \"name\": \"tallybook-web\",\n  \"private\": true,\n  \"type\": \"module\",\n  \"scripts\": { \"dev\": \"vite\", \"build\": \"vite build\" },\n  \"dependencies\": { \"react\": \"18.3.1\", \"react-dom\": \"18.3.1\" },\n  \"devDependencies\": { \"@vitejs/plugin-react\": \"4.3.4\", \"autoprefixer\": \"10.4.20\", \"postcss\": \"8.4.49\", \"tailwindcss\": \"3.4.17\", \"vite\": \"5.4.11\" }\n}\n",
  "tailwind.config.js": "export default {\n  content: [\"./index.html\", \"./src/**/*.{js,jsx}\"],\n  theme: { extend: { colors: { accent: { DEFAULT: \"#0f766e\", soft: \"#ccfbf1\" } } } },\n  plugins: [],\n};\n",
  "index.html": "<!doctype html>\n<html lang=\"en\">\n  <head><meta charset=\"UTF-8\" /><title>Tallybook</title></head>\n  <body><div id=\"root\"></div><script type=\"module\" src=\"/src/main.jsx\"></script></body>\n</html>\n",
  "src/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
  "src/main.jsx": "import React from \"react\";\nimport { createRoot } from \"react-dom/client\";\nimport App from \"./App.jsx\";\nimport \"./index.css\";\n\ncreateRoot(document.getElementById(\"root\")).render(<App />);\n",
  "src/App.jsx": "import { useState } from \"react\";\nimport Invoices from \"./pages/Invoices.jsx\";\n\nconst pages = [{ id: \"invoices\", label: \"🧾 Invoices\", element: <Invoices /> }];\n\nexport default function App() {\n  const [current, setCurrent] = useState(\"invoices\");\n  const page = pages.find((p) => p.id === current);\n  return (\n    <div className=\"flex min-h-screen bg-zinc-50 text-zinc-900\">\n      <nav className=\"w-60 border-r border-zinc-200 bg-white p-4\">\n        <p className=\"mb-4 text-sm font-medium\">Tallybook</p>\n        {pages.map((p) => (\n          <button\n            key={p.id}\n            onClick={() => setCurrent(p.id)}\n            className={`block w-full rounded-md px-3 py-2 text-left text-sm ${p.id === current ? \"bg-zinc-100 font-medium\" : \"text-zinc-600 hover:bg-zinc-50\"}`}\n          >\n            {p.label}\n          </button>\n        ))}\n      </nav>\n      <main className=\"flex-1 p-8\">{page.element}</main>\n    </div>\n  );\n}\n",
  "src/pages/Invoices.jsx": "const invoices = [\n  { id: \"INV-1042\", client: \"Somsri Bakery\", amount: 18400, status: \"Paid\" },\n  { id: \"INV-1043\", client: \"Chai Logistics\", amount: 52750, status: \"Open\" },\n  { id: \"INV-1044\", client: \"Mali Dental Clinic\", amount: 9600, status: \"Overdue\" },\n];\n\nconst baht = new Intl.NumberFormat(\"th-TH\", { style: \"currency\", currency: \"THB\", maximumFractionDigits: 0 });\n\nexport default function Invoices() {\n  return (\n    <section>\n      <h1 className=\"text-xl font-medium\">Invoices</h1>\n      <table className=\"mt-6 w-full rounded-xl border border-zinc-200 bg-white text-sm\">\n        <thead className=\"text-left text-zinc-500\">\n          <tr><th className=\"p-3 font-normal\">Invoice</th><th className=\"p-3 font-normal\">Client</th><th className=\"p-3 text-right font-normal\">Amount</th><th className=\"p-3 font-normal\">Status</th></tr>\n        </thead>\n        <tbody>\n          {invoices.map((i) => (\n            <tr key={i.id} className=\"border-t border-zinc-100\">\n              <td className=\"p-3\">{i.id}</td><td className=\"p-3\">{i.client}</td>\n              <td className=\"p-3 text-right tabular-nums\">{baht.format(i.amount)}</td><td className=\"p-3 text-zinc-600\">{i.status}</td>\n            </tr>\n          ))}\n        </tbody>\n      </table>\n    </section>\n  );\n}\n"
};
for (const [file, body] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body, { flag: 'wx' });
}
UI_FIXTURE
