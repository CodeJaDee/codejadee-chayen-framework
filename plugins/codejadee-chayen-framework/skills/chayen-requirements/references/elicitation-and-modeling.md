---
kind: recipe
capabilities: [CAP-02-001, CAP-02-004, CAP-02-005]
---
# Elicitation, use cases, and business rules

This recipe does three things:

- turns a vague request into explicit requirements with the smallest set of
  targeted questions;
- models the behaviour as actors and use cases;
- extracts business rules from code, SQL, configuration, or documents, citing
  the source.

All output goes into the requirements record (template).

## Inputs

- The request as stated, who asked, and their role.
- Known context: the domain, the existing system, constraints, any linked
  ticket or document.
- **For use cases:** the process description, roles, and goals.
- **For rule extraction:** the code, SQL, configuration, or documents that
  implement or state the rules, with read access.

## Procedure

1. **Restate the request** in one sentence. Separate the stated need from any
   proposed solution, for example "add a dropdown" versus "let users choose a
   region". A proposed solution is recorded but not adopted as the
   requirement.
2. **Elicit with targeted questions,** grouped by topic:

   | Topic | Example question |
   |---|---|
   | Goal and success | What decision or task becomes possible, and how will we know it worked? |
   | Users and roles | Who uses it? Who must not? |
   | Data | Which data is read or changed? What is its source of truth? |
   | Rules | Which conditions change the outcome? |
   | Constraints | Deadline, compliance, platforms, integrations |
   | Exceptions | What happens when the data is missing, late, or wrong? |

   Ask only the questions whose answers change the outcome. Batch them once.
   Answers go to confirmed facts, each citing the answer as its source.
   Unanswered items become assumptions or open decisions.
3. **Model the use cases.**
   1. List the actors, both human and system.
   2. For each goal, write one use case:
      - name (verb and object);
      - primary actor;
      - preconditions;
      - main success scenario (numbered steps);
      - extensions (`3a. <condition>: <behaviour>`);
      - postconditions.
   3. Each stated exception becomes an extension.
   4. Each extension with no stated behaviour becomes an open decision.
4. **Extract business rules from code or SQL.**
   1. Locate where decisions are made: conditionals on domain values,
      validators, pricing or eligibility calculators, database constraints,
      triggers, stored procedures, and feature or configuration flags.
   2. For each rule, record:
      - the condition;
      - the outcome;
      - the source (`path:line`);
      - the confidence: `found` when the code shows it directly, `inferred`
        when it is reconstructed across several places.
   3. Never generalize beyond what the code shows. A threshold seen in one
      branch is not assumed to apply elsewhere.
5. **Extract business rules from documents.** Quote or closely paraphrase,
   with the section reference. Mark the document's date or version if known.
6. **Compare sources.** When code and a document, or two documents,
   disagree, record each version as a fact with its source. Then add an open
   decision: "which is intended?", owned by the business owner.
7. **Record everything** in the requirements record.

## Outputs

- **Question set,** grouped by topic, with the reason each question matters.
- **Draft requirement statements,** each marked confirmed (with its source)
  or assumed.
- **Actor list and use cases** in the format of step 3.
- **Rule table:**

  ```text
  | Rule | Condition | Outcome | Source | Confidence |
  | R1 | order total ≥ 100 and customer tier = Gold | 10% discount | src/Pricing/OrderCalculator.cs:42 | found |
  ```

- Contradictions between sources, listed as open decisions.

## Technology considerations

| Stack | Where rules usually live |
|---|---|
| .NET | Domain services, `switch` and `if` on enums, FluentValidation validators, DataAnnotations, EF Core model configuration (`HasCheckConstraint`, required or maximum length) |
| TypeScript / JavaScript / Angular / React / Vue | Zod, Yup, or Valibot schemas; Angular validators; form rules duplicated client-side (report a duplicated rule once, with both sources) |
| Nitro / Elysia / Next.js / Nuxt server code | Route-level schema validation (TypeBox, Zod) and guard functions |
| Python | Pydantic validators, Django model `clean()` and constraints, service functions |
| SQL Server / PostgreSQL | `CHECK` constraints, triggers, stored procedures, views with filtering logic, computed columns |
| Configuration | Thresholds and feature flags in `appsettings*.json`, `.env`, or flag services. The rule is then "configurable", and its current value is environment-specific (state which environment was read). |

## Verification

- Every confirmed fact and every rule cites a source. Rules read from code
  cite `path:line`, and the condition and outcome can be checked at that
  line.
- No rule appears that no source states or implements.
- Every use-case extension has a behaviour or an open decision.
- The questions were asked once, and only outcome-changing ones.
- Contradictions are reported, never resolved silently.
