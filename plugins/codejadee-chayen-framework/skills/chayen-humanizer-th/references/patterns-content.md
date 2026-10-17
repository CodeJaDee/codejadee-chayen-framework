---
kind: checklist
---
# Thai content patterns (TH-08 to TH-14)

Passage-level signals: openings, claims, repetition and leftovers that make
Thai copy read as generated or padded. Apply the same strength and cluster
rules as the language patterns (`patterns-language.md`).

## Before acting on a content pattern

- **No new facts.** Replacing generic text with specifics is right only when
  the specifics already exist in the source or the user supplies them. Do not
  invent benefits, numbers, customers, quotes, awards or citations.
- **Ask instead of guessing.** When the only fix needs a missing fact, flag
  it and ask, or write a plainer sentence that claims less.
- **Respect approved copy.** Taglines, slogans, legal notices and quoted
  testimonials that the owner approved are protected even when they match a
  pattern; report them instead of rewriting them.

## TH-08 Formulaic introductions (strong)

- **Signals:** "ในยุคดิจิทัลที่เทคโนโลยีเปลี่ยนแปลงอย่างรวดเร็ว", "ในโลกปัจจุบันที่...", "ไม่ว่าคุณจะเป็นมือใหม่หรือมืออาชีพ", "คุณเคยสงสัยไหมว่า...", "บทความนี้จะพาคุณไปรู้จักกับ...", "เชื่อว่าหลายคนคงเคย...", "มาดูกันเลย!"
- **Why:** the opening could front any article on any topic. It delays the point, and the reader learns nothing until the second paragraph.
- **Not a tell when:** the hook is specific to this topic and reader; the question is one the article then answers concretely; or it is the established format of the author's column.
- **Before:** "ในยุคดิจิทัลที่เทคโนโลยีเปลี่ยนแปลงอย่างรวดเร็ว การทดสอบซอฟต์แวร์ถือเป็นสิ่งที่ขาดไม่ได้ บทความนี้จะพาคุณไปรู้จักกับ Playwright เครื่องมือทดสอบที่กำลังได้รับความนิยม"
- **After:** "บทความนี้แนะนำ Playwright เครื่องมือทดสอบซอฟต์แวร์ที่กำลังได้รับความนิยม"
- **Preserve:** the claims the opening actually makes ("กำลังได้รับความนิยม" stays). If the body explains what makes the tool useful, move that concrete point into the opening rather than writing a new one.

## TH-09 Excessive promotional language (strong in documentation, weak alone in marketing)

- **Signals:** ล้ำสมัย, ปฏิวัติวงการ, ยกระดับ...ไปอีกขั้น, ไร้รอยต่อ, ครบจบในที่เดียว, ตอบโจทย์ทุกความต้องการ, ที่สุดแห่ง..., อย่างที่ไม่เคยมีมาก่อน; stacked adjectives such as "ง่าย สะดวก รวดเร็ว ทันสมัย".
- **Why:** generic praise fits every product, so it says nothing about this one, and readers discount it. Documentation and product details need the concrete benefit.
- **Not a tell when:** the page is marketing copy in a deliberately promotional brand voice (reduce stacking, keep the energy); the phrase is an approved tagline; or it appears inside a quoted testimonial.
- **Before:** "แพลตฟอร์มล้ำสมัยที่จะยกระดับการทำงานของทีมคุณไปอีกขั้น ด้วยประสบการณ์ไร้รอยต่อที่รวมแชต งาน และไฟล์ไว้ในแอปเดียว"
- **After:** "รวมแชต งาน และไฟล์ของทีมไว้ในแอปเดียว"
- **Preserve:** the concrete benefit already in the source (chat, tasks and files in one app). When the source has no concrete benefit, ask for one; do not supply it.

## TH-10 Exaggerated or unsupported claims (strong; never fixed by inventing evidence)

- **Signals:** absolutes such as "ปลอดภัย 100%", "ไม่มีวันล่ม", "เร็วที่สุดในตลาด", "อันดับ 1"; authority with no source ("ผู้เชี่ยวชาญหลายท่านยืนยัน", "ใคร ๆ ก็ใช้"); round multipliers ("เร็วขึ้น 10 เท่า") with no stated measurement.
- **Why:** inflated claims cost trust, and some advertising or regulated claims carry legal risk for the owner. Generated text tends to inflate.
- **Not a tell when:** the text states the evidence (benchmark conditions, a named source, a dated award or certification), or the user confirms the claim is verified and wants it kept.
- **Before:** "ระบบของเราปลอดภัย 100% และเร็วกว่าคู่แข่งถึง 10 เท่า"
- **After (audit finding, no rewrite):** "'ปลอดภัย 100%' ตรวจสอบไม่ได้ ควรแทนด้วยสิ่งที่ยืนยันได้ เช่น มาตรฐานที่ผ่านการรับรอง และ '10 เท่า' ต้องระบุว่าวัดอะไร เทียบกับระบบใด เจ้าของเนื้อหาต้องยืนยันก่อนแก้"
- **Preserve:** every number exactly. Do not delete, soften or round a figure without the owner's agreement, and never add a citation, source or certification name yourself.

## TH-11 Verbosity and repeated conclusions (strong for a repeated summary)

- **Signals:** "โดยสรุปแล้ว", "กล่าวโดยสรุป", "ท้ายที่สุดนี้" closing a short text; a last paragraph that restates every point; filler such as "ในส่วนของ", "ในเรื่องของ", "เป็นที่เรียบร้อยแล้ว", "ได้อย่างง่ายดาย"; doubled synonyms ("รวดเร็วและฉับไว"); a heading repeated as the first sentence.
- **Why:** Thai readers skim. Restating dilutes the content and makes a short text feel padded.
- **Not a tell when:** a long report or proposal expects a summary section; an executive summary or README quick-start deliberately condenses; or repetition is rhetorical in a speech or script.
- **Before:** "ในส่วนของการติดตั้ง ผู้ใช้สามารถทำการติดตั้งได้อย่างง่ายดายด้วยคำสั่ง `npm install` ซึ่งจะติดตั้งให้เป็นที่เรียบร้อย โดยสรุปแล้ว การติดตั้งนั้นง่ายและรวดเร็ว"
- **After:** "ติดตั้งได้ง่าย ๆ ด้วยคำสั่ง `npm install`"
- **Preserve:** the command exactly, and one evaluative phrase when the author's voice needs it. Remove the repetition, not the author's judgment.

## TH-12 Rhythm by rule: forced triads, contrasts and dramatic closers (weak alone)

- **Signals:** every list has three items ("ง่าย เร็ว และปลอดภัย"); "ไม่ใช่แค่...แต่คือ..." as a reflex; one-line closers ("และนี่คือจุดเริ่มต้นของอนาคต", "เพราะ...คือทุกสิ่ง"); a rhetorical question answered in the next sentence.
- **Why:** the shape is chosen before the content, so the rhythm repeats and the claims become vague.
- **Not a tell when:** the content really has three parts; "ไม่ใช่...แต่..." corrects a real misunderstanding; or the line is an approved slogan.
- **Before:** "เครื่องมือนี้ไม่ใช่แค่ linter แต่คือผู้ช่วยที่เข้าใจโค้ดของคุณ มันตรวจ style แก้ import และจัด format ให้อัตโนมัติ เพราะโค้ดที่ดีคือทุกสิ่ง"
- **After:** "เครื่องมือนี้ตรวจ style แก้ import และจัด format โค้ดให้อัตโนมัติ"
- **Preserve:** the actual list of functions. Three real items stay three items.

## TH-13 Chatbot residue and writing about the document (strong)

- **Signals:** "แน่นอนค่ะ! นี่คือ...", "ด้านล่างนี้คือ...ที่คุณขอ", "หวังว่าบทความนี้จะเป็นประโยชน์", "หากมีคำถามเพิ่มเติม สามารถสอบถามได้เลย", "ในฐานะ AI...", knowledge-cutoff disclaimers, "ในบทความนี้เราจะ..." before every section, unfilled placeholders such as "[ชื่อบริษัท]".
- **Why:** these are leftovers from a chat reply. They never belong in published copy and reveal how the text was produced.
- **Not a tell when:** a business-owned contact line is part of the page ("ติดต่อทีมซัพพอร์ตได้ที่..."); a newsletter or letter has a genuine sign-off; or the document's convention includes a table of contents.
- **Before:** "แน่นอนครับ! ด้านล่างนี้คือคำอธิบายสินค้าที่คุณขอ: กระเป๋าผ้าแคนวาสกันน้ำ จุของได้ 20 ลิตร หวังว่าจะเป็นประโยชน์นะครับ"
- **After:** "กระเป๋าผ้าแคนวาสกันน้ำ จุของได้ 20 ลิตร"
- **Preserve:** the content itself. Flag unfilled placeholders and ask for the values; never fill them with invented names, prices or dates.

## TH-14 Decorative formatting (weak alone)

- **Signals:** bold every few words; an emoji on every heading or bullet; headings over two-sentence sections; English Title Case headings in Thai documents; bullets that chop a flowing argument; a bold lead and colon on every line.
- **Why:** formatting should help scanning. Heavy decoration is a common generated-text signal and makes Thai text, which has no spaces between words, harder to read.
- **Not a tell when:** the project style guide uses emoji (for example in changelog conventions); a UI component requires a heading or label; or a landing page section is deliberately designed as short blocks.
- **Before:** "## 🚀 **ข้อดี**ของ**ระบบ**ใหม่ ✨ — **เร็ว** **ง่าย** และ **ปลอดภัย**"
- **After:** "## ข้อดีของระบบใหม่"
- **Preserve:** structure that other files or tools depend on: heading text that anchors link to, frontmatter, table columns and list markers that a parser reads. Changing a heading can break an anchor link elsewhere, so check before renaming one.
