---
kind: recipe
capabilities: [CAP-14-007, CAP-14-008]
---
# Root-cause analysis and postmortems

Find the root and contributing causes of a failure with evidence for each
link, separating the trigger, the cause, and the missing safeguards, and
write a blameless postmortem with owned, dated action items that prevent or
detect recurrence.

## Inputs

- Incident data: the timeline, alerts, dashboards, logs, traces, and
  deployment and change history.
- Code and configuration history for the components involved.
- The team's postmortem template, if any, and the people who own follow-up
  work.

## Procedure

### Root-cause analysis (CAP-14-007)

1. **Rebuild the timeline** from evidence: first symptom, detection,
   escalation, mitigation, and recovery, each timestamped with its source.
2. **Correlate with changes:** deployments, configuration, certificates,
   dependency incidents, traffic, and data changes around the start.
3. **Build the causal chain** with "why" questions, attaching evidence to
   each link (a log line, a metric, a commit). Stop when the next answer is
   outside the team's control or is a missing safeguard.
4. **Separate the parts:**
   - **trigger:** what started it (a deploy, a traffic spike, an expiry);
   - **root cause:** the condition that turned the trigger into an outage;
   - **contributing factors:** what made it worse or longer (retry storms,
     missing timeouts, unclear alerts);
   - **missing safeguards:** tests, alerts, limits, or reviews that would
     have prevented or shortened it.
5. **Test the hypothesis** where safe: reproduce locally or in staging, or
   show that the evidence rules out alternatives. Mark unproven links as
   such.

### Postmortem (CAP-14-008)

1. **Use the team's template,** or the standard sections: summary, impact
   (users, duration, data, money where known), timeline, root cause and
   contributing factors, detection, response, what went well, what went
   badly, and action items.
2. **Write blamelessly:** describe systems, decisions, and information
   available at the time. No individual is named as the cause; roles may be
   named for timeline clarity.
3. **Create action items** that each prevent recurrence, detect it sooner,
   or reduce impact, with an owner field, a due date, and a tracking link.
   Avoid vague items ("be more careful").
4. **Mark facts versus assumptions,** and list open questions.
5. **Share for review** with the people involved before publishing.

## Outputs

- A causal chain with evidence for each link, contributing factors, and
  missing safeguards.
- A postmortem in the team's template, with action items that have owners
  and dates, each preventing or detecting recurrence.

## Technology considerations

| Stack | Consideration |
|---|---|
| Version control | `git log` and deployment history for the window, and the diff of the suspect change. |
| Telemetry | Traces and logs correlated by trace ID, metrics around the start time, and deployment markers. |
| .NET, Node, Python services | Exception logs with stack traces, dependency call failures, thread-pool or event-loop saturation, and retry policies that amplify load. |
| Databases (SQL Server, PostgreSQL) | Deadlock and lock-wait logs, long-running queries, failed migrations, and data changes in the window. |
| Certificates and secrets | Expiry dates, rotation events, and identity provider incidents, which often trigger cascading failures. |

## Verification

- The seeded root cause in a fixture incident (an expired certificate behind
  a retry storm) is identified as the cause, with the retry storm as a
  contributing factor.
- Every link in the causal chain cites evidence, or is marked unproven.
- The postmortem names no individual as the cause, and every action item
  has an owner field and a due date.
