---
kind: recipe
capabilities: [CAP-10-008, CAP-10-009, CAP-10-010]
---
# Property-based, mutation, and fuzz testing

Use generated inputs to find cases example-based tests miss, measure how
strong the existing tests are with mutation testing, and fuzz parsers and
input handlers for crashes and hangs. All three cost run time, so each run
is scoped and time-boxed, and every finding becomes an ordinary regression
test. Fuzzing applies only to the user's own code.

## Inputs

- The function or module under test, and the invariants it must satisfy
  (for properties), the scope and time budget (for mutation), or the input
  format and sample inputs (for fuzzing).
- The test command, and a green baseline for the module.
- The tools already installed, or approval to add one.

## Procedure

### Property-based testing (CAP-10-008)

1. **Name the properties** before writing generators:
   - round trip: `decode(encode(x)) == x`;
   - invariants: output sorted, total preserved, no overlap after merging;
   - idempotence: `f(f(x)) == f(x)`;
   - oracle: the result equals a simple reference implementation;
   - metamorphic: changing the input in a known way changes the output in
     a known way.
2. **Write generators for the valid domain,** composing from the library's
   primitives. Filter sparingly, because heavy filtering slows generation.
3. **Keep runs bounded:** the library's default example count in the pull
   request suite, more in a nightly run if the user wants it.
4. **On failure, record the shrunk counterexample and the seed,** reproduce
   it with that seed, and add it as an explicit example-based regression
   test.

### Mutation testing (CAP-10-009)

1. **Scope the run** to one module or project. Full-codebase runs can take
   hours. Agree the time budget.
2. **Confirm a green baseline,** because mutation tools need passing tests.
3. **Run the tool** and record the mutation score, and killed, survived,
   timed-out, and no-coverage counts.
4. **Classify the survivors:**
   - **equivalent:** the mutant behaves the same as the original, so ignore
     it and say why;
   - **low value:** logging or messages, unless they are part of the
     contract;
   - **meaningful:** a real behaviour change no test detects.
5. **Write tests that kill the meaningful survivors,** asserting
   behaviour, not implementation details.
6. **Run again** with the same scope, and report the score before and
   after. Add a CI threshold only if the user agrees.

### Fuzz testing (CAP-10-010)

1. **Confirm ownership:** the target is the user's own code, run locally or
   in their CI. Never fuzz external systems or services.
2. **Pick a pure target:** a parser or decoder function that takes bytes or
   a string, with no network or database calls.
3. **Write the harness** with the stack's fuzzer, and a seed corpus from
   valid, sanitized samples (no real personal data).
4. **Run with limits:** a time limit, memory limit, and timeout per input,
   in an isolated environment.
5. **Triage findings:** minimize each crashing input, deduplicate by stack
   trace, and classify (crash, hang, excessive memory, unexpected
   exception type).
6. **Turn every finding into a regression test** with the minimized input,
   and report the product defect. Fixing it is a separate, approved change.

## Outputs

- Property tests with generators and stated invariants, and any
  counterexample found with its seed.
- The mutation score and surviving mutants grouped by significance, plus
  new or improved tests that kill selected survivors.
- A fuzz harness, seed corpus, and run instructions with a time limit, plus
  crashes found, minimized, and turned into regression tests.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | FsCheck or CsCheck for properties (with xUnit or NUnit integration packages). Stryker.NET (`dotnet stryker --project <Project>`) for mutation. SharpFuzz with libFuzzer for fuzzing. |
| JavaScript and TypeScript | fast-check (`fc.assert(fc.property(...))`, `seed` and `path` in failure output). StrykerJS (`npx stryker run`) with the Vitest or Jest runner. Jazzer.js for fuzzing. |
| Python | Hypothesis (`@given`, the example database, `@reproduce_failure`). mutmut (`mutmut run`, `mutmut results`) or Cosmic Ray. Atheris for fuzzing. Hypothesis can also drive byte-level inputs where no fuzzer is installed. |
| CI | Property tests run in the normal suite. Mutation and fuzz runs belong in scheduled jobs with time limits unless the user decides otherwise. |

## Verification

- The property test finds the seeded boundary bug in the fixture and
  reports a shrunk counterexample with its seed, which is then kept as a
  regression test.
- The mutation score for the fixture module rises after the added tests,
  with both runs shown, or each run is NOT_RUN or BLOCKED with the reason.
- The fuzz harness finds the seeded crash in the fixture parser within the
  time limit, and the crash becomes a regression test.
- No fuzzing targeted code or systems the user does not own.
