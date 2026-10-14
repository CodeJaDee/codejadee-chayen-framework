---
kind: recipe
capabilities: [CAP-17-009]
---
# LLM application red-teaming

Red-team the user's own LLM application, with authorization, for prompt
injection (direct and indirect), data exfiltration, jailbreaks, harmful
output, and excessive agency, record observed results per attack class, and
propose mitigations that are enforced in code and permissions rather than
in prompts alone. The output is advisory.

## Inputs

- The application architecture: system prompts, tools and their
  permissions, data sources (including retrieved documents), and who the
  users are.
- Written authorization to test, the environment to test in (non-production
  by default), and any limits.
- Known risks and past incidents.

## Procedure

1. **Confirm authorization and scope:** the application belongs to the user
   or their organization, testing is authorized, and the target is a test
   environment unless the owner approves otherwise. Decline anything else.
2. **Map the attack surface:** inputs the model reads (user messages,
   documents, web pages, tool results), tools it can call, data it can see,
   and actions with side effects.
3. **Write test cases per attack class:**

   | Class | Example test |
   |---|---|
   | Direct injection and jailbreak | Instructions to ignore the system prompt or adopt a persona |
   | Indirect injection | Instructions hidden in a retrieved document, email, or web page |
   | Data exfiltration | Requests for other users' data, system prompts, or secrets; markdown image links that leak data |
   | Excessive agency | Getting the model to call a tool with consequential effects without confirmation |
   | Harmful or off-policy output | Content outside the product's policy |
   | Denial of wallet | Inputs that cause runaway tool loops or token use |

4. **Run the cases** after approval, in the agreed environment, and record
   observed results (blocked, partially, succeeded) with the transcript
   excerpt, never claiming a result that was not observed.
5. **Propose mitigations by layer:** least-privilege tools and per-call
   authorization on the server, human confirmation for consequential
   actions, separation of untrusted content, output validation and
   filtering, rate and cost limits, and monitoring.
6. **Turn successful attacks into regression cases** in the eval set.

## Outputs

- Test cases by attack class with observed results.
- Mitigations (privilege limits, output filtering, human confirmation),
  labelled advisory, with the controls that would enforce them.

## Technology considerations

| Stack | Consideration |
|---|---|
| Python | Red-team harnesses in pytest or promptfoo red-team configurations, run against a test deployment. |
| .NET | `Microsoft.Extensions.AI` middleware for input and output checks, tool filters in Semantic Kernel, server-side authorization per tool call. |
| TypeScript | Tool definitions with server-side permission checks, and output validation with schemas before acting. |
| RAG applications | Seed injection text in a test document, and check it is treated as data and cannot trigger tools. |
| Hosted content filters | Provider content safety features are one layer; they do not replace application-level permissions. |

## Verification

- The indirect injection seeded in a fixture document is included as a test
  case with a mitigation.
- Every recorded result is observed in the agreed environment, or the case
  is NOT_RUN.
- No test targeted a system the user does not own, and the report is
  labelled advisory.
