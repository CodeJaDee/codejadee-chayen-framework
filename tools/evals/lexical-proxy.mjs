// Developer-only SIMULATED lexical routing proxy (STEP 32; shared since evolution Step 18). BM25 of a prompt
// against each Skill's name and description, the metadata providers list before activation. It is not a
// model and not a provider, can never support VERIFIED, and must never be used to tune descriptions
// (EG-13). Zero dependencies; never shipped with the plugin.

const STOP = new Set("a an and are as at be by can do does for from has have how i in into is it its me my of on or our should so that the their them then this to use we what when where which why will with without you your not only all any".split(" "));
export const lexicalTokens = (s) => s.toLowerCase().replace(/[^a-z0-9.#+]+/g, " ").split(" ").filter((w) => w.length > 1 && !STOP.has(w));

// skills: [{ skill, description }] -> rank(prompt) = [{ skill, score }] sorted by score, highest first.
export function lexicalRanker(skills) {
  const docs = skills.map((s) => ({ skill: s.skill, terms: lexicalTokens(`${s.skill.replace("chayen-", "")} ${s.description}`) }));
  const df = {}; for (const d of docs) for (const t of new Set(d.terms)) df[t] = (df[t] ?? 0) + 1;
  const avgLen = docs.reduce((a, d) => a + d.terms.length, 0) / docs.length;
  const bm25 = (q, d) => { let s = 0; const tf = {}; for (const t of d.terms) tf[t] = (tf[t] ?? 0) + 1; for (const t of new Set(lexicalTokens(q))) { if (!tf[t]) continue; const idf = Math.log(1 + (docs.length - df[t] + 0.5) / (df[t] + 0.5)); s += idf * (tf[t] * 2.2) / (tf[t] + 1.2 * (0.25 + 0.75 * d.terms.length / avgLen)); } return s; };
  return (q) => docs.map((d) => ({ skill: d.skill, score: bm25(q, d) })).sort((a, b) => b.score - a.score);
}

// Fixed threshold rule, not tuned for F1: half the median top score of the positive prompts.
export function lexicalThreshold(rank, positivePrompts) {
  const top = positivePrompts.map((p) => rank(p)[0].score).sort((a, b) => a - b);
  return 0.5 * top[Math.floor(top.length / 2)];
}
