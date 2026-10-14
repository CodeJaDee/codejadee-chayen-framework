---
kind: recipe
capabilities: [CAP-11-010]
---
# Privacy review of a feature

Assess how a feature collects, uses, stores, shares, and deletes personal
data: build a personal-data inventory from the code and design, identify
privacy risks, and propose minimization, consent, and protection measures.
This is an engineering review. It is advisory and is not legal advice or a
compliance determination.

## Inputs

- The feature description, its data fields (forms, API payloads, database
  columns, events, logs, analytics), and the processing purposes.
- The regions and users served, and any privacy policy or data
  classification the organization already has.
- Third parties that receive data (analytics, email, payment, AI
  services).

## Procedure

1. **Build the personal-data inventory** from code and design: each field,
   its category (identifier, contact, location, financial, health,
   biometric, children's data, free text that may contain anything), where
   it is collected, stored, logged, sent, and how long it is kept.
2. **State the purpose per field,** and flag fields with no clear purpose
   (minimization candidates) or reused for a second purpose.
3. **Raise lawful-basis and consent questions for the owner:** which basis
   applies, whether consent is needed and how it is recorded and withdrawn.
   The agent asks; it does not decide the legal basis.
4. **Check data-subject operations:** can the user see, export, correct,
   and delete their data, and does deletion reach logs, backups, caches,
   search indexes, and third parties (hand retention mechanics to the data
   skill).
5. **Identify risks:** over-collection, precise location or sensitive
   categories, identifiers in logs and analytics, sharing without
   agreements, cross-border transfer, re-identification of
   "anonymous" data, and access by too many staff.
6. **Propose measures:** collect less, coarsen (city instead of GPS
   coordinates), pseudonymize, encrypt sensitive fields, separate
   identifiers from analytics, shorten retention, restrict access, and
   document third-party processing.
7. **Label the result** advisory and not legal advice, and list the
   questions only the owner, legal, or the privacy office can answer.

## Outputs

- A personal-data inventory with purpose, storage, retention, sharing, and
  lawful-basis questions for the owner.
- Risks and minimization measures, marked advisory and not legal advice.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | Data annotations or classification attributes with `Microsoft.Extensions.Compliance` redaction, Identity's personal-data download and delete endpoints (`[PersonalData]`), logging redaction. |
| Node servers and frontends | Analytics SDKs and session replay tools capture inputs by default: check masking settings. Cookies and local storage for identifiers. |
| Python | Django model fields and admin exposure, Celery task arguments that carry personal data into broker storage and logs. |
| Databases (SQL Server, PostgreSQL) | Column-level encryption, dynamic data masking (SQL Server) or views, and row-level security for staff access. |
| AI and third-party APIs | Personal data sent in prompts or payloads to external services needs the owner's approval and a processing agreement. |

## Verification

- Every personal field in the fixture feature appears in the inventory,
  with its storage and sharing locations.
- The output states that it is advisory and not legal advice, and does not
  decide a legal basis or compliance status.
- Each risk has at least one proposed measure, and open questions name who
  must answer them.
- Each check is reported PASS or FAIL with the field or risk it applies to,
  or NOT_RUN with the reason (for example, a data flow that could not be
  traced in the code).
