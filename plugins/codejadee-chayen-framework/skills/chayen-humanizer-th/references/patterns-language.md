---
kind: checklist
---
# Thai language patterns (TH-01 to TH-07)

Sentence-level signals that Thai text was translated from English or
assembled by rule. Each pattern is a signal to examine, not a banned phrase.

## How to use these patterns

- **Strength.** A *strong* pattern justifies an edit on one clear sighting.
  A *weak alone* pattern needs other signals in the same passage before you
  change anything.
- **Cluster, then act.** Several patterns together are the evidence. One
  common phrase in otherwise natural text is not.
- **Fix the sentence, not the phrase.** Restate the point the way a Thai
  writer would say it to this reader; do not swap one stock phrase for another.
- **Never change meaning to remove a pattern.** If the natural version would
  lose a condition, number, negation or obligation, keep the original wording.

## TH-01 Literal translation from English (strong)

- **Signals:** English scaffolding carried into Thai: "มันเป็นสิ่งสำคัญที่จะ..." (It is important to), "สิ่งนี้ช่วยให้คุณสามารถ..." (This allows you to), "ในการที่จะ..." (In order to), "เมื่อพูดถึง..." (When it comes to), "ในแง่ของ..." (In terms of), "ไม่ว่าคุณจะเป็น...หรือ..." (Whether you are), "ทำให้แน่ใจว่า..." repeated as a reflex.
- **Why:** Thai clauses lead with the verb and drop dummy subjects. The English frame adds words without meaning and tells the reader the text was translated.
- **Not a tell when:** it is a quoted or deliberately literal translation, a standard or legal text that must mirror its source, or a single "ทำให้แน่ใจว่า" in a checklist where it is the clearest instruction.
- **Before:** "มันเป็นสิ่งสำคัญที่จะต้องทำให้แน่ใจว่าคุณได้ทำการสำรองข้อมูลก่อนที่จะทำการอัปเกรด"
- **After:** "ต้องสำรองข้อมูลก่อนอัปเกรด"
- **Preserve:** the strength of the obligation (ต้อง, ควร, อาจ), conditions and the order of steps. "จะต้อง" stays a requirement; it does not become a suggestion.

## TH-02 Overused passive with ถูก and ได้รับการ (weak alone)

- **Signals:** ถูก with neutral or positive events ("ฟีเจอร์นี้ถูกพัฒนาขึ้นโดยทีมของเรา", "ไฟล์จะถูกสร้างขึ้น"), and stacked "ได้รับการ..." ("ได้รับการออกแบบมาเพื่อ...") in sentence after sentence.
- **Why:** in established Thai usage ถูก typically marks events that affect the subject adversely (ถูกขโมย, ถูกระงับ). A neutral passive copied from English reads as translated. Active voice, a verb that works without an object, or a single ได้รับ are the usual alternatives.
- **Not a tell when:** the event is genuinely adverse ("บัญชีถูกระงับ", "เซิร์ฟเวอร์ถูกโจมตี"); the agent is unknown and the passive is the clearest statement in reference documentation; or the project's existing docs use the construction consistently.
- **Before:** "ฟีเจอร์นี้ถูกออกแบบมาเพื่อช่วยให้ทีมสามารถทำงานร่วมกันได้อย่างมีประสิทธิภาพ"
- **After:** "ฟีเจอร์นี้ออกแบบมาให้ทีมทำงานร่วมกันได้อย่างมีประสิทธิภาพ"
- **Preserve:** who performs the action. If the source does not say who, do not invent an actor such as "ทีมงาน" or "ระบบ" unless the context states it.

## TH-03 Stacked nominalization: การ, ความ, ทำการ, มีการ (weak alone)

- **Signals:** a verb buried inside a noun phrase: "ทำการติดตั้ง", "ได้ทำการตรวจสอบ", "ดำเนินการแก้ไข", "มีการเปลี่ยนแปลง"; chains such as "การจัดการการตั้งค่าการแจ้งเตือน" or "ความสามารถในการ..." where a plain verb would do.
- **Why:** a Thai verb can carry the sentence by itself. Wrapping it in การ or a helper verb slows reading and sounds bureaucratic in ordinary copy.
- **Not a tell when:** the register is official correspondence or legal text, where "ดำเนินการ" is expected; "มีการ" reports an event with no specific actor ("มีการเปลี่ยนแปลง API ในเวอร์ชัน 3"); or the phrase is a product UI label or menu name, which is protected.
- **Before:** "ผู้ใช้สามารถทำการเปลี่ยนแปลงการตั้งค่าการแจ้งเตือนได้ที่หน้าโปรไฟล์"
- **After:** "ผู้ใช้เปลี่ยนการตั้งค่าการแจ้งเตือนได้ที่หน้าโปรไฟล์"
- **Preserve:** UI labels exactly as the product displays them. Here "การตั้งค่าการแจ้งเตือน" could be a menu name, so it stays.

## TH-04 Repetitive connectors (strong when three or more cluster)

- **Signals:** consecutive sentences opening with นอกจากนี้, อีกทั้ง, ยิ่งไปกว่านั้น, อย่างไรก็ตาม, ดังนั้น, ทั้งนี้ or ในขณะเดียวกัน; ซึ่ง chaining clause after clause; โดย opening every clause.
- **Why:** a connector should mark a real relation. Mechanical connectors, often carried over from Furthermore, However and Therefore, flatten the rhythm and can assert a cause or contrast that the content does not have.
- **Not a tell when:** one connector marks a genuine contrast or consequence; academic or legal text needs explicit logical links; or the author's voice uses a connector deliberately and sparingly.
- **Before:** "ระบบนี้รองรับภาษาไทย นอกจากนี้ยังรองรับภาษาอังกฤษ ยิ่งไปกว่านั้นยังมี dark mode อย่างไรก็ตาม ผู้ใช้ต้องอัปเดตแอปก่อน ดังนั้นควรตรวจสอบเวอร์ชัน"
- **After:** "ระบบรองรับทั้งภาษาไทยและภาษาอังกฤษ และมี dark mode แต่ต้องอัปเดตแอปก่อน จึงควรตรวจสอบเวอร์ชันที่ใช้อยู่"
- **Preserve:** every real condition and contrast (ต้อง, แต่, ถ้า). Remove a connector only when the relation survives in the sentence.

## TH-05 Unnatural Thai sentence structure (weak alone)

- **Signals:** a subject pronoun in every sentence (คุณ... คุณ... คุณ...); มัน for products or features in formal copy; ของ chains ("การตั้งค่าของบัญชีของผู้ใช้ของคุณ"); English modifier order; long sentences with no breathing space; ungrammatical "เป็น" before an adjective ("ระบบนี้เป็นเร็วมาก"); "สามารถที่จะ...ได้" doubled.
- **Why:** Thai drops subjects the reader can recover, prefers topic-then-comment order and often needs no ของ. Structures copied from English feel stiff even when every word is correct.
- **Not a tell when:** a style guide asks for consistent direct address with คุณ; repetition is deliberate emphasis; the text is dialogue or a quotation; or มัน belongs to a casual author's established voice.
- **Before:** "คุณสามารถเปิดแอปของคุณ แล้วคุณจะเห็นปุ่มสำหรับการตั้งค่าของบัญชีของคุณที่มุมขวาบน"
- **After:** "เปิดแอป แล้วจะเห็นปุ่มตั้งค่าบัญชีที่มุมขวาบน"
- **Preserve:** who does what wherever dropping the subject would make the actor ambiguous, and any exact on-screen label.

## TH-06 Awkward Thai-English technical terminology (strong for inconsistency)

- **Signals:** one term spelled several ways in the same text (อัปเดต, อัพเดท, update); code identifiers transliterated into Thai script; Thai coinages that the stated audience does not use, or the reverse, English nouns forced into Thai grammar ("ทำการ deploy ไปที่ production"); English plural endings inside Thai sentences ("หลาย components"); inconsistent casing of product names.
- **Why:** developers read technical terms as identifiers. Inconsistency looks careless and can mislead. Royal Institute forms are the standard for formal text, but a brand glossary or the project's developer convention may legitimately differ.
- **Not a tell when:** the variation is a deliberate glossary decision; the English term has no Thai equivalent the audience uses; the text is formal or government content that uses Royal Institute coinages; or the word is a product or brand name.
- **Before:** "หลังจากทำการ deploy แอพพลิเคชั่นแล้ว ให้อัพเดท environment variables ทั้งหมด แล้ว restart เซิร์ฟเวอร์"
- **After:** "หลัง deploy แอปพลิเคชันแล้ว ให้อัปเดต environment variable ทุกตัว แล้ว restart เซิร์ฟเวอร์"
- **Preserve:** identifiers, commands, variable names, inline code and the user's glossary. "แอปพลิเคชัน" and "อัปเดต" are Royal Institute forms; when the brand writes them differently, follow the brand and only fix inconsistency.

## TH-07 Register or tone that does not fit the reader (strong when it conflicts with the stated audience)

- **Signals:** official register in a casual developer blog (อนึ่ง, ทั้งนี้ทั้งนั้น, จึงเรียนมาเพื่อทราบ); slang or emoji in formal documentation or error messages; ครับ and ค่ะ mixed in one voice; shifting pronouns (คุณ, ท่าน, ผู้ใช้, เธอ); blaming UI text ("คุณกรอกผิด"); basics re-explained to experts, or jargon left unexplained for beginners.
- **Why:** Thai encodes social distance through register, pronouns and particles. A mismatch is felt at once and undermines trust more than a small grammar slip.
- **Not a tell when:** the register is a deliberate brand voice; the text quotes someone; or the channel requires formality, such as legal notices or government correspondence.
- **Before (consumer app error):** "ท่านได้กรอกข้อมูลไม่ถูกต้อง กรุณาดำเนินการกรอกใหม่อีกครั้ง"
- **After:** "ข้อมูลบางช่องยังไม่ถูกต้อง กรุณาตรวจสอบแล้วลองอีกครั้ง"
- **Preserve:** the politeness level the brand requires, mandatory legal wording, and which field or action the message refers to. Name a specific field only when the source identifies it.
