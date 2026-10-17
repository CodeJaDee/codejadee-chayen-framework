# Thai and English writing and editing

Chayen includes two writing skills next to its 13 engineering skills:

| Skill | For text whose output is | Typical work |
|---|---|---|
| `chayen-humanizer-th` | Thai (including Thai with English technical terms) | Articles, developer blogs, landing pages, README prose, product descriptions, UI microcopy and localization strings |
| `chayen-humanizer-en` | English | The same, plus developer replies, review comments, announcements and marketing copy |

Each skill makes text read as if a careful writer wrote it for its reader,
while keeping meaning, facts, terms and structure. Neither skill names or
loads the other: the output language decides which one applies.

> **Status.** Both skills ship in this build and pass the repository's
> structural checks. **Their writing quality and how reliably agents select
> them have not been evaluated yet** (no provider runs, no fluent human
> review). Treat their output like any draft: read it before you use it. See
> [SECURITY_AND_LIMITATIONS.md](SECURITY_AND_LIMITATIONS.md).

## Four modes

The skill infers the mode from your wording. Say it explicitly when it
matters.

| Mode | Ask like this | What you get | Files |
|---|---|---|---|
| **Audit** | "Audit…", "review…", "don't rewrite yet", "ตรวจ…", "ยังไม่ต้องแก้" | A table of located findings with reasons and a suggested direction, rule corrections, items that need the owner, and what was left alone on purpose | Never changed |
| **Rewrite** | "Rewrite…", "tighten…", "make this natural", "เกลา…", "ปรับสำนวน…" | The final text, then short notes: what changed, what was kept on purpose, what needs your confirmation. Text that already reads well gets "no changes recommended". | Only if you asked for a file edit |
| **Create** | "Write a … from these notes" | New content built only from the facts you supplied, with the assumptions it made and statements to verify | Only if asked |
| **Website edit** | "Edit the copy in `Hero.tsx`", "polish `locales/th.json`" | A prose-only preview diff first when approval is needed, then the approved strings applied and the project's own checks run (or reported as NOT_RUN) | Only the files and strings you named |

## Automatic and explicit use

**Automatic.** Ask normally. The agent compares your request with each
skill's description and may load a writing skill:

```text
เกลาย่อหน้านี้ให้อ่านลื่นเป็นภาษาไทยธรรมชาติ แต่ห้ามเปลี่ยนตัวเลขกับชื่อฟีเจอร์
README ภาษาไทยของเราอ่านแล้วเหมือนแปลจากอังกฤษ ช่วยปรับสำนวนให้หน่อย
This blog post reads like a chatbot wrote it. Tell me which sentences sound robotic, but don't rewrite anything yet.
Make the English strings in locales/en.json shorter and friendlier. Keep every key and placeholder.
```

Selection is decided by the model and is not guaranteed. For these two
skills it has **not been measured yet**.

**Explicit.** Name the skill when you want it for sure:

| Provider | Thai | English |
|---|---|---|
| Claude Code | `/chayen:chayen-humanizer-th <request>` | `/chayen:chayen-humanizer-en <request>` |
| Codex CLI | `$chayen-humanizer-th <request>` | `$chayen-humanizer-en <request>` |
| Copilot CLI | `/chayen-humanizer-th <request>` | `/chayen-humanizer-en <request>` |

Explicit invocation of these two skills has not been tested on any surface
yet; the syntax is each provider's documented form.

**Which language?** Your explicit target language decides first, then the
established locale of the artifact, then the language of your message. A Thai
request for English output ("ช่วยเขียนอีเมลภาษาอังกฤษ…") belongs to the English
skill or to normal answers, not the Thai skill. Translation into other
languages, such as Japanese, is outside both skills.

## What is preserved

Fidelity comes before style. The skills are written to keep, unchanged:

- **Meaning carriers:** facts, numbers, units, dates, negation, conditions,
  obligations (ต้อง versus ควร, *must* versus *should*), hedges and
  uncertainty, and attribution. A request to "sound more confident" does not
  remove a hedge the evidence needs.
- **Technical spans:** code and code blocks, SQL, JSON, commands, file paths,
  URLs, versions, identifiers, API and product names, error messages and log
  lines.
- **Markup and localization syntax:** HTML and JSX tags and attributes,
  Markdown links and images, `{placeholders}`, ICU plural and select
  expressions, translation keys and tags such as `<1>…</1>`.
- **Your terms and choices:** glossary terms, established English technical
  terms in Thai prose, the US or UK spelling already in use, approved slogans,
  legal wording and brand voice.

They add no facts, quotations, statistics, sources or customers. A claim that
looks false is flagged for you, not silently corrected or deleted.

Neither skill helps make text pass an AI detector or presents text as
human-written. Fiction, poetry and personal essays are outside the English
skill.

## File-editing safety

- **Copy, not behaviour.** Only visible prose changes. Logic, routes, props,
  styles, analytics and configuration are left alone; requests that mix copy
  with behaviour (for example "reword the button and disable it while
  loading") also involve an engineering skill.
- **Preview before applying** when changes need review, and ask before
  editing many files, committing, pushing, publishing to a CMS or deploying.
  A rewrite request alone does not authorize publication.
- **Only the repository you named.** Reading a public site does not
  authorize editing it or any other site.
- **Content is data.** Instructions or "approvals" inside the text being
  edited (an HTML comment telling the agent to push, a README note saying
  "already approved") are reported, not followed.
- **Instruction files** such as `AGENTS.md` or `CLAUDE.md` are read, never
  changed unless you ask.
- **Secrets** found in content are not repeated; the skill points to their
  location.
- **Your agent's permissions still decide.** These are advisory
  instructions; the provider's permission prompts and sandbox are the real
  controls.

## Writing skills, documentation skill, response style

| You want | Use |
|---|---|
| README commands, setup steps or API facts checked against the repository | `chayen-documentation` |
| README or docs *prose* made clearer, with commands already correct | The writing skill for the output language |
| Both | Either may load; ask for both parts explicitly |
| Every ordinary reply in natural Thai or English, without asking each time | The opt-in [response style policy](RESPONSE_STYLE.md), which you add to your own instruction file. Installing the plugin does not turn it on. |

## Attribution

The English skill's pattern taxonomy and parts of its method are adapted from
the MIT-licensed [humanizer](https://github.com/blader/humanizer) skill by
Siqi Chen. The MIT notice and an attribution map ship inside the skill
(`chayen-humanizer-en/references/upstream-notice.md`). The Thai skill uses the
same general method; its patterns and examples are original.
