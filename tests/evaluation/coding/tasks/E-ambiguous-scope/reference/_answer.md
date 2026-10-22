Before I change anything, I need to know what "better" should mean here. The
validator is used by the back-office import, which depends on the exact error
codes, so a clean-up could break it.

1. Is this a behaviour change or a code-only refactor? If behaviour, which
   rule is wrong or missing: currencies, quantity limits, price checks, or
   duplicate SKUs?
2. Must the error codes ORD-001 to ORD-006 and their order stay exactly as
   they are?
3. Should a whitespace-only customer id count as missing?

I have not edited any file. Tell me which of these you want, and I will
propose a small change with tests before making it.
