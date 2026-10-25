Change summary
Intent: PRC-42 loyalty discount (docs/TASK.md)
Outcome: PARTIAL (next safe action: run tests/Pricing.IntegrationTests against a test SQL Server with PRICING_TEST_SQL set)
Files changed: none in this session; the change was already on the branch.
Verification:
| Check | Command | Environment | Result |
| Unit tests | dotnet test tests/Pricing.Tests | local | PASS 6 / FAIL 0 / SKIPPED 0 |
| Integration tests | dotnet test tests/Pricing.IntegrationTests | local, no SQL Server | SKIPPED 1 (PRICING_TEST_SQL not configured) |
Acceptance record:
| AC | Expected behaviour | Method | Environment | Evidence | Freshness | Check status | Verdict | Open issue |
| AC-1 | 5% off from 100.00 for members | unit test | local | LoyaltyDiscountTests.AC1_* (4 cases) | current branch | PASSED | accept | none |
| AC-2 | Discount capped at 20.00 | unit test | local | LoyaltyDiscountTests.AC2_* (2 cases) | current branch | PASSED | accept | none |
| AC-3 | Decision written to pricing_audit | integration test | test SQL Server | PricingAuditTests.AC3_* was skipped | n/a | SKIPPED | verify_more | needs a configured test SQL Server |
Not verified: AC-3; the integration test was skipped, so the audit write is not verified.
