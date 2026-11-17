---
kind: checklist
---
# Thai technical writing (หลักการเขียนเอกสารเทคนิคภาษาไทย)

Write and review Thai so an IT reader understands the system accurately. This
lens covers register, clarity and form. It never changes a specification. For
general Thai prose such as articles and marketing copy, the
chayen-humanizer-th skill applies; this checklist keeps only what matters for
technical documents. The project's own glossary and existing documents
override any preference stated here.

## Protected spans

Mark these before editing, translating or rewriting, and compare them after.
Change one only when the user asks for that exact change.

- Class, method, function, variable, queue, topic and service names.
- API endpoints, HTTP methods, headers and status codes.
- Database, schema, table, column, index and constraint names.
- Environment variables, configuration keys and feature flags.
- File paths, URLs, command lines and scripts.
- Error codes, log messages quoted from the system, and message identifiers.
- Product, vendor and protocol names; version numbers.
- Numbers, units, ranges, dates, limits and thresholds, with the digit system
  and the calendar era the source uses.
- Requirement identifiers and cross-references.
- Conditions, exceptions and scope words: "เฉพาะ", "ยกเว้น", "อย่างน้อย",
  "ทุก", "ต่อหนึ่งคำขอ", "ก่อน", "หลัง".
- Quoted and approved wording.

Never insert Thai spacing, tone marks or hyphenation into an identifier.
Keep an identifier in a code span (`OrderSync`, `dbo.Order_Header`) so Thai
punctuation or line breaking does not alter it.

## Register

Use clear, formal but natural Thai, in the third person. Avoid:

- literal translations from English and stacked auxiliaries
  ("ดำเนินการทำการ", "ทำการ" before a verb that stands alone);
- bureaucratic padding ("ทั้งนี้ ทั้งนั้น", "เป็นที่เรียบร้อย" with no
  information) and repetition of the same clause;
- unclear referents: "มัน", "นี้", "ดังกล่าว" with several possible nouns;
  name the component instead;
- very long sentences; one sentence carries one idea, one condition or one step;
- conversational or marketing wording, and unsupported claims such as
  "รวดเร็วมาก", "ปลอดภัยสูง" with no figure or source (flag the claim, do not
  delete a statement that may carry a requirement).

| Awkward | Natural, when the evidence supports the actor |
|---|---|
| โปรแกรมประยุกต์จะดำเนินการทำการส่งข้อมูลไปยังฐานข้อมูล | แอปพลิเคชันส่งข้อมูลไปยังฐานข้อมูล |
| มีการทำการตรวจสอบสิทธิ์ของผู้ใช้งาน | ระบบตรวจสอบสิทธิ์ของผู้ใช้งาน (when the system is the verified actor) |
| ข้อมูลจะถูกทำการจัดเก็บไว้ในตาราง `Order_Header` | ระบบจัดเก็บข้อมูลในตาราง `Order_Header` |

The natural form must still describe verified behavior. When the source does
not name the actor, use a passive form and keep the ambiguity.

## Editing without changing the design

A language correction must not become a technical decision. Supply no actor,
frequency, mechanism or condition that the source does not state.

| Source | Safe action |
|---|---|
| "The data will be send to another system every day." | "ข้อมูลถูกส่งไปยังระบบอื่นทุกวัน" The actor and schedule stay as stated; raise the missing actor as a question |
| Same sentence, with evidence that the application sends it on a schedule | "แอปพลิเคชันส่งข้อมูลไปยังระบบภายนอกทุกวัน" and cite the evidence for the actor and the schedule |
| "ระบบควรตรวจสอบข้อมูลนำเข้า" while another section says "ต้อง" | Report the inconsistency; do not pick one |
| "ระบบลองเรียกซ้ำเมื่อล้มเหลว" | Do not add a retry count or interval; ask for the configured values |

## Requirement semantics

Preserve the distinction between obligation, recommendation and permission.
These mappings are context-sensitive starting points, not a find-and-replace.

| English keyword | Thai form | Trap |
|---|---|---|
| MUST, SHALL | ต้อง | Writing "ควร" or "จะ" for tone; using "ต้อง" for a plain fact in a sentence that is not a requirement |
| MUST NOT, SHALL NOT | ต้องไม่ (or "ห้าม", when the project uses it consistently) | Softening to "ไม่ควร" |
| SHOULD | ควร | Hardening to "ต้อง" |
| SHOULD NOT | ไม่ควร | Reading it as a prohibition |
| MAY | อาจ ... ได้ or "สามารถ ... ได้" for permission | "อาจ" alone can read as "possibly happens"; make permission clear |

"จะ", "สามารถ" and "ได้" are not requirement keywords. A statement of future
behavior ("ระบบจะส่งอีเมล") is not an obligation unless the source marks it
with a keyword. If the source mixes keyword and plain wording and the intent
is unclear, keep the text and raise a question; do not normalize silently.
Where ambiguity is likely, add the source keyword in parentheses at the first
use, for example "ระบบต้อง (MUST) ปฏิเสธโทเค็นที่หมดอายุ", and follow the
project's convention when it has one.

Also preserve logical conditions, negation, exceptions, scope and
uncertainty: "ถ้า ... และ ...", "ไม่ ... ทั้งหมด" and "ทุก ... ไม่" differ in
meaning, so check negation scope after every rewrite.

## Formatting and readability

- Keep one heading hierarchy and the document's numbering; do not renumber
  cross-referenced sections.
- Write Thai and Latin text consistently with the document's existing
  convention for spacing; do not impose a spacing rule that alters an
  identifier, a command or a path.
- Use Arabic digits for technical values unless the source uses Thai digits;
  never convert one system to the other silently. Keep decimal and thousands
  separators as in the source.
- Keep the calendar era (พ.ศ. or ค.ศ.) the source states, and add the era
  when a bare year could be misread.
- Keep units exactly (GB, ms, req/s) and do not convert or round.
- Introduce each acronym once with its meaning, then use it consistently; use
  the glossary when the document has one.
- Number procedures; one action per step; state the expected result and the
  preconditions first.
- Caption each diagram and table in Thai and refer to it by the same label in
  the text; the names inside a diagram must match the text.
- Keep requirement identifiers (for example REQ-0012) unchanged and in the
  position the template uses.

## Review checks

| Area | What to check |
|---|---|
| Grammar and spelling | Word choice, particles, tone marks, typos, mixed registers |
| Clarity | One idea per sentence; clear subject; no stacked auxiliaries |
| Terminology | One term per concept; glossary terms used as defined |
| Ambiguity | Unclear actor, scope, schedule, pronoun or condition |
| Requirement language | Strength preserved; keyword and plain wording not mixed without reason |
| Technical accuracy | Statements match the evidence, or carry a status |
| Consistency | Names, numbers and flows agree between text, tables and diagrams |

## Verification

- Compare protected spans between the original and the edited text, item by
  item (PASS or FAIL).
- Confirm no requirement keyword changed strength and negation scope is intact.
- Confirm that no actor, schedule, mechanism or value was added.
- Confirm the glossary and acronym usage stayed consistent after the edit.
- Report any change you were unsure about as a question, not a correction.
