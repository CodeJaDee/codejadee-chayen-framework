---
kind: template
---
# Output formats (รูปแบบผลลัพธ์)

Use the format for the mode, written in Thai. Prefer Markdown. Keep an
existing document's template, numbering, headings, table structure and
reference conventions. Word-oriented structure (numbered headings, tables, a
revision table and a caption for each figure) is expressed in plain Markdown.
Do not claim a DOCX or PDF file exists unless the host created it. Keep
identifiers, paths and commands in code spans, in their original spelling.

## Template

### WRITE (เขียนเอกสารใหม่)

```markdown
# <ชื่อเอกสาร>

| รายการ | รายละเอียด |
|---|---|
| ประเภทเอกสาร | Technical Document / Application Design / Infrastructure Design |
| เวอร์ชันและวันที่ | <จากผู้ใช้หรือโครงการ> |
| ผู้อ่านและวัตถุประสงค์ | <ที่ระบุ> |
| ผู้จัดทำและผู้ตรวจสอบ | <จากผู้ใช้ เว้นไว้หากไม่ทราบ> |

## 1. วัตถุประสงค์และขอบเขต

## <หัวข้อตามรายการตรวจของประเภทเอกสาร ใช้เลขหัวข้อตามที่โครงการกำหนด>
<เนื้อหา พร้อมอ้างอิงแหล่งข้อมูลของข้อความทางเทคนิคทุกข้อ>

## แหล่งข้อมูลอ้างอิง
| รหัส | แหล่งข้อมูล | ตำแหน่ง | ตรวจสอบแล้ว |
|---|---|---|---|

## ข้อสมมติฐาน
| รหัส | ข้อความ | ผู้รับผิดชอบ | ผลกระทบหากไม่เป็นจริง |
|---|---|---|---|

## ประเด็นที่ยังต้องยืนยัน
| รหัส | คำถาม | หัวข้อ | สถานะ | ผู้รับผิดชอบ |
|---|---|---|---|---|
```

### REVIEW (ตรวจสอบเอกสาร)

```markdown
## สรุปผลการตรวจสอบ
<สองถึงสี่ประโยค: คุณภาพโดยรวม ความเสี่ยงหลัก และสิ่งที่ยังไม่ได้ตรวจ>

## รายการข้อค้นพบ
### วิกฤต / สำคัญ / เล็กน้อย
| รหัส | ตำแหน่งที่พบ | ข้อความเดิม | ข้อความที่แนะนำ | เหตุผลในการแก้ไข | สถานะหลักฐาน |
|---|---|---|---|---|---|
```

### UPDATE (ปรับปรุงเอกสาร)

```markdown
## สรุปการเปลี่ยนแปลง
เอกสารเดิม: <ชื่อ เวอร์ชัน> ข้อมูลปัจจุบัน: <แหล่งที่ตรวจสอบ>

## เปรียบเทียบเอกสารเดิมกับข้อมูลปัจจุบัน
| หัวข้อ | สถานะ | การเปลี่ยนแปลง | หลักฐาน |
|---|---|---|---|
| (ไม่เปลี่ยนแปลง / แก้ไข / ยกเลิก / เพิ่มใหม่ / ยังไม่ได้รับการยืนยัน) | | | |

## รายการที่ต้องตรวจสอบเพิ่มเติม
## ข้อแตกต่างที่ยังไม่ได้ข้อสรุป
## ประวัติการแก้ไขเอกสาร (Revision History)
| เวอร์ชัน | วันที่ | รายละเอียด | ผู้แก้ไข |
|---|---|---|---|
```

The updated document follows, with the original structure preserved.

### AUDIT (ประเมินเอกสาร)

```markdown
## สรุปผลการประเมิน
ขอบเขต เวอร์ชันเอกสาร ชุดหลักฐาน และผลโดยสรุปหนึ่งย่อหน้า

## Findings Register
| รหัส | ระดับ | หัวข้อ | ข้อค้นพบ | หลักฐาน | สถานะ | ข้อเสนอแนะ | ผู้รับผิดชอบ |
|---|---|---|---|---|---|---|---|

## Gap Analysis
| ด้านที่ประเมิน | ครบถ้วน / บางส่วน / ไม่มี / ไม่เกี่ยวข้อง | หมายเหตุ |
|---|---|---|

## Evidence Status
## ข้อเสนอแนะในการดำเนินการ
## ประเด็นที่ยังค้างอยู่
```

### CONSISTENCY (เปรียบเทียบความสอดคล้อง)

```markdown
## รายชื่อเอกสารที่เปรียบเทียบ
| เอกสาร | เวอร์ชันและวันที่ | ภาษา | ตรวจสอบแล้ว |
|---|---|---|---|

## Consistency Matrix
| รหัส | หัวข้อที่เปรียบเทียบ | เอกสาร A (หัวข้อ ค่า) | เอกสาร B (หัวข้อ ค่า) | แหล่งข้อมูลอ้างอิง | ระดับ |
|---|---|---|---|---|---|

## รายการข้อมูลที่ขัดแย้งกัน
## แนวทางการแก้ไข
## ประเด็นที่ต้องให้เจ้าของระบบตัดสินใจ
```

### TRANSLATION (แปลเป็นภาษาไทย)

```markdown
<เอกสารภาษาไทย โครงสร้างและเลขหัวข้อตามต้นฉบับ>

## รายการคำศัพท์
| คำภาษาไทย | คำภาษาอังกฤษ | หัวข้อที่ใช้ครั้งแรก | แหล่งที่มาของการเลือกคำ |
|---|---|---|---|

## ข้อความต้นฉบับที่กำกวม
| ตำแหน่งในต้นฉบับ | ข้อความต้นฉบับ | การตีความที่เป็นไปได้ | สถานะ |
|---|---|---|---|

## สรุปการตรวจความเทียบเท่า
| หัวข้อ | ตัวเลขและตัวระบุ | ระดับของข้อกำหนด | สถานะของข้อความ | ผล |
|---|---|---|---|---|
```

## Rules

- Lead with the summary, then the findings, then the detail.
- Order findings by severity, then by document order.
- Use one row per finding; keep the evidence in its own column.
- Mark every value that is not Verified with its status in the same row,
  using the Thai status labels from the evidence reference.
- State what was not inspected before any statement about completeness.
- Keep the same finding fields in every mode so results can be combined.
- Keep the report in the conversation unless the user names a file.
