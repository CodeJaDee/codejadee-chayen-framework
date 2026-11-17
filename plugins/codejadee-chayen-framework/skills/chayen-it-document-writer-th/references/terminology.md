---
kind: checklist
---
# Terminology (คำศัพท์เทคนิค)

Decide, per term, whether to keep English, write Thai, or give both. The
order of authority is: the project glossary and existing approved documents,
then the owner's stated convention, then this guidance. Never rename a term
that an existing document or system already uses.

## Choosing the form

| Situation | Form | Example |
|---|---|---|
| Widely used IT term where a Thai equivalent would reduce clarity | Keep English, in Thai sentence | "ระบบเรียก API ของระบบบัญชี" |
| Concept readers may not know, first use in the document | Thai explanation, then the English term in parentheses | "การยืนยันตัวตน (Authentication)" |
| Same term later in the document | Use the form chosen at first use, without repeating the explanation | "การยืนยันตัวตนใช้โทเค็น ..." |
| A project glossary entry exists | Use the glossary form exactly | follow the glossary |
| No established Thai term and a coined translation could mislead | Keep English and add a short Thai description once | "Idempotency (คุณสมบัติที่เรียกซ้ำแล้วให้ผลเท่าเดิม)" |
| Identifier, product, protocol or standard name | Never translate | `OrderSync`, TLS 1.2, OAuth 2.0 |

Use natural Thai around the term. Do not coin a new Thai word, and do not
transliterate a term in several spellings; pick one spelling and keep it.

## Terms usually kept in English

API, Database, Server, Firewall, Middleware, Load Balancer, Reverse Proxy,
Authentication, Authorization, Deployment, Microservices, Container,
Kubernetes, CI/CD, Cache, Queue, Webhook, Token, Schema, Migration, Endpoint,
Cluster, Failover, Rollback, Throughput, Latency. Capitalization follows the
document; keep it the same everywhere.

## Common Thai wording

These are starting points that follow common professional usage. Check them
against the project glossary before use.

| English | Common Thai | Note |
|---|---|---|
| system | ระบบ | Name the specific system or component when several exist |
| application | แอปพลิเคชัน | "โปรแกรมประยุกต์" reads stiff; use only if the project does |
| user | ผู้ใช้งาน | Distinguish roles (ผู้ดูแลระบบ for administrator) |
| input / output | ข้อมูลนำเข้า / ผลลัพธ์ (or ข้อมูลส่งออก) | Keep one pair per document |
| requirement | ความต้องการ or ข้อกำหนด | ข้อกำหนด suits a normative requirement |
| business rule | กฎทางธุรกิจ | |
| workflow / process | กระบวนการทำงาน | |
| interface / integration | การเชื่อมต่อ / การเชื่อมต่อกับระบบภายนอก | Name the direction |
| error handling | การจัดการข้อผิดพลาด | |
| non-functional requirement | ข้อกำหนดที่ไม่ใช่ด้านฟังก์ชัน | |
| constraint | ข้อจำกัด | |
| assumption | ข้อสมมติฐาน | |
| environment | สภาพแวดล้อม | Environment names (Production, UAT) stay in English |
| availability | ความพร้อมใช้งาน | Never add a percentage that the source lacks |
| backup / restore | การสำรองข้อมูล / การกู้คืนข้อมูล | |
| disaster recovery | การกู้คืนระบบจากภัยพิบัติ (Disaster Recovery) | |
| monitoring / logging | การเฝ้าระวังระบบ (Monitoring) / การบันทึก Log | |
| capacity planning | การวางแผนขีดความสามารถ (Capacity Planning) | |
| traceability | การสืบย้อน (Traceability) | |

## Glossary handling

- Build or update a term list when a document introduces more than a few
  terms: Thai form, English term, first-use section, source of the choice.
- When writing or translating, apply the list throughout, and report any term
  the glossary and the existing text disagree on instead of choosing.
- When reviewing, flag a concept that has two Thai names, a term used before
  it is introduced, and an English term whose first use has no explanation
  where one is needed.
- Do not explain the same term more than once unless a new section stands
  alone for a different reader.

## Verification

- Every term has one form across the document (PASS or FAIL per term).
- No identifier, product or protocol name was translated.
- Introduced terms have their explanation at first use only.
- New or disputed terms are listed for the owner, not decided silently.
