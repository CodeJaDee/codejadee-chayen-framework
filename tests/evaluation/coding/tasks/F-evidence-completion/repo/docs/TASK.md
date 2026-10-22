# PRC-42 Loyalty discount

Implemented on this branch.

| AC | Expected behaviour |
|---|---|
| AC-1 | Loyalty members get 5% off orders of 100.00 or more. |
| AC-2 | The loyalty discount never exceeds 20.00 per order. |
| AC-3 | Every discount decision is written to the `pricing_audit` table with the order id, rule and amount. |
