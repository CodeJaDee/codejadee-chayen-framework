---
kind: recipe
capabilities: [CAP-14-010]
---
# Runbooks

Write runbooks for alerts and operational tasks that someone woken at night
can follow: the trigger, diagnosis steps with copy-pasteable commands and
expected output, mitigation, escalation, and verification, with every
mutating or destructive step marked for confirmation.

## Inputs

- The alert or task, and the system access paths (consoles, CLIs, dashboards)
  the operator has.
- The existing runbook format and location.
- Known causes and fixes from past incidents, and escalation contacts or
  roles.

## Procedure

1. **Follow the team's format and location,** or use the template below.
2. **Describe the trigger:** the alert name and condition, or the task's
   purpose, and the user impact if it fires.
3. **Write diagnosis steps** in order, each with a read-only command or
   dashboard link, the expected output when healthy, and what each
   abnormal result means.
4. **Write mitigation steps** with exact commands, the environment
   placeholder made explicit, the expected effect, and a **CONFIRM** marker
   on every mutating or destructive step (restart, scale, failover, purge,
   delete), naming who may approve it.
5. **Add escalation:** when to escalate, to which role or rota, and what
   information to hand over.
6. **Add verification:** how to confirm recovery (metric back to normal,
   alert resolved), and where to record the action.
7. **Test the read-only steps** where access allows, and mark untested
   steps. Review with an on-call engineer.
8. **Link it** from the alert rule.

## Outputs

- A runbook with copy-pasteable commands, expected outputs, mitigation with
  confirmation markers, escalation, and verification.

## Template

```markdown
# Runbook: <alert or task name>

**Trigger:** <alert rule and condition, or when to run this task>
**Impact:** <who is affected and how>
**Access needed:** <roles, tools>

## Diagnose
1. <check> — `<read-only command>` — expected: <healthy output>. If <abnormal>, go to step <n>.

## Mitigate
1. CONFIRM (approver: <role>) — `<command>` — expected effect: <effect>. Undo: `<command>`.

## Escalate
- When <condition>, page <rota> with: <what to hand over>.

## Verify
- <metric or check> returns to <normal value>; the alert resolves within <time>.
- Record actions in <incident channel or ticket>.
```

## Technology considerations

| Stack | Consideration |
|---|---|
| Kubernetes | `kubectl get`, `describe`, and `logs` for diagnosis; `rollout restart`, `scale`, and `rollout undo` are mutating and marked CONFIRM. |
| Azure and AWS CLIs | Read-only `show` and `list` commands for diagnosis; `restart`, `swap`, and failover commands are mutating. |
| .NET, Node, Python services | Health endpoints, version endpoints, and the service's metrics for diagnosis. |
| Queues and databases | Backlog depth and consumer lag queries; purging a queue or killing sessions are destructive and marked CONFIRM. |
| Credential rotation tasks | Ordered steps that create the new secret, update consumers, verify, then revoke the old one, never printing values. |

## Verification

- Each step in the fixture runbook has a command and an expected result.
- Destructive and mutating steps are marked for confirmation with an
  approver role and an undo where one exists.
- No command in the runbook prints a secret value.
