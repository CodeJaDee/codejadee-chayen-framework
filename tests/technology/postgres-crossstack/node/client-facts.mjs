// Developer-only JavaScript client facts for cross-stack date/time and number precision (XF-07, XF-09).
// Dependency-free; prints one JSON line per fact for run-fact-checks.mjs.
import assert from "node:assert/strict";

const results = [];
const check = (id, fn) => {
  try { results.push({ id, status: "PASS", note: fn() ?? "" }); }
  catch (e) { results.push({ id, status: "FAIL", note: e.message }); }
};

check("XF-07", () => {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // The three shapes an API can send for "10:00 on 1 January 2026":
  const withOffset = Date.parse("2026-01-01T10:00:00+07:00");
  const withoutOffset = Date.parse("2026-01-01T10:00:00");   // e.g. a .NET DateTime with Kind=Unspecified
  const dateOnly = Date.parse("2026-01-01");
  assert.equal(withOffset, Date.UTC(2026, 0, 1, 3, 0, 0));                 // an instant: same everywhere
  assert.equal(withoutOffset, new Date(2026, 0, 1, 10, 0, 0).getTime());   // read in the BROWSER's zone
  assert.equal(dateOnly, Date.UTC(2026, 0, 1));                            // date-only strings are read as UTC
  const shiftHours = (withoutOffset - Date.UTC(2026, 0, 1, 10)) / 3600000;
  return `runtime zone ${zone}: a zone-less date-time shifts by ${shiftHours} h from UTC; a date-only value is UTC midnight, so formatting it locally can show the previous or next day`;
});

check("XF-09", () => {
  const parsed = JSON.parse('{"bigId":9007199254740993,"total":19.99}');
  assert.equal(parsed.bigId, 9007199254740992);                // silently rounded above Number.MAX_SAFE_INTEGER
  assert.equal(Number.isSafeInteger(parsed.bigId), false);
  assert.notEqual(0.1 + 0.2, 0.3);                             // binary floating point
  assert.equal((19.99 * 100), 1998.9999999999998);
  assert.equal(JSON.parse('{"id":"9007199254740993"}').id, "9007199254740993");   // a string keeps every digit
  return "9007199254740993 parses as 9007199254740992; 19.99*100 = 1998.9999999999998; string-encoded ids keep their digits";
});

for (const r of results) console.log(JSON.stringify(r));
