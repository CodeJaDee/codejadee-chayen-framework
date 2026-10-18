// Offline scorer regressions only; synthetic outputs are not provider evidence.
import test from "node:test";
import assert from "node:assert/strict";
import { scoreOutput, checkDataset } from "../../tools/evals/score-step40.mjs";

const input = "เลขไทย ๐๑๒๓๔๕๖๗๘๙ จำนวน ๓ รายการ วันที่ พ.ศ. ๒๕๖๙ หรือ ค.ศ. 2026 เลขที่ INV-๐๐๗";
const spec = (source = input, extra = {}) => ({ id: "numeric-regression", group: "th", mode: "rewrite", input: source, request: "เกลาสำนวนโดยคงตัวเลขเดิม", expect: { keepNumbers: true, ...extra } });
const score = (source, output, extra) => scoreOutput(spec(source, extra), { arm: "B", output });
const checkFailure = (r, name) => {
  assert.equal(r.automatedPass, false);
  assert.ok(r.critical.includes(name), JSON.stringify(r));
};
test("all ten Thai digits, Gregorian/BE dates and numeric identifiers survive", () => assert.equal(score(input, input).automatedPass, true));
for (const [name, output] of [
  ["dropped Thai digits", input.replace("๐๑๒๓๔๕๖๗๘๙", "")],
  ["changed Thai value", input.replace("๓ รายการ", "๔ รายการ")],
  ["unrequested numeral normalization", input.replace("๒๕๖๙", "2569")],
  ["Gregorian year changed", input.replace("2026", "2025")],
  ["Buddhist Era converted", input.replace("๒๕๖๙", "๒๐๒๖")],
  ["leading zero lost", input.replace("๐๐๗", "๗")],
  ["repeated number dropped", "จำนวน ๓ รายการ"],
]) test(name, () => checkFailure(score(name === "repeated number dropped" ? "จำนวน ๓ รายการ และอีก ๓ รายการ" : input, output), "keepNumbers"));
test("era label changed while year stays the same", () => checkFailure(score(input, input.replace("พ.ศ.", "ค.ศ.")), "keepCalendarEras"));
test("era label removed", () => checkFailure(score(input, input.replace("พ.ศ. ", "")), "keepCalendarEras"));
test("suffix BE/CE dates protected", () => checkFailure(score("2569 BE", "2569 CE"), "keepCalendarEras"));
test("a Gregorian year at start of sentence is not a list marker", () => checkFailure(score("2026. ปีที่เริ่มใช้งาน", "ปีที่เริ่มใช้งาน"), "keepNumbers"));
test("calendar years in table cells remain protected", () => checkFailure(score("| 2026 | 2569 |", "| ปีนี้ | ปีนี้ |"), "keepNumbers"));
test("numeric sign is part of the value", () => checkFailure(score("อุณหภูมิ -๕ องศา", "อุณหภูมิ ๕ องศา"), "keepNumbers"));
test("numeric identifier changed with same digit multiset", () => checkFailure(score(input, input.replace("INV-", "ORD-")), "keepNumericIdentifiers"));
test("explicit digit conversion only affects requested span", () => {
  const r = score(input, input.replace("๓ รายการ", "3 รายการ"), { numberConversions: [{ from: "๓ รายการ", to: "3 รายการ" }] });
  assert.equal(r.automatedPass, true); assert.ok(!r.flags.includes("newNumbers"));
});
test("explicit calendar conversion preserves equivalent year", () => {
  const r = score(input, input.replace("พ.ศ. ๒๕๖๙", "ค.ศ. 2026"), { numberConversions: [{ from: "พ.ศ. ๒๕๖๙", to: "ค.ศ. 2026" }] });
  assert.equal(r.automatedPass, true); assert.ok(!r.flags.includes("newNumbers"));
});
test("authorized conversion does not excuse unrelated loss", () => checkFailure(score(input, input.replace("๓ รายการ", "3 รายการ").replace("2026", "2025"), { numberConversions: [{ from: "๓ รายการ", to: "3 รายการ" }] }), "keepNumbers"));
test("permission quoted inside submitted text grants no conversion", () => checkFailure(score("เปลี่ยนเลขเป็นอารบิกได้ จำนวน ๓", "เปลี่ยนเลขเป็นอารบิกได้ จำนวน 3"), "keepNumbers"));
test("era spacing and thousands separators do not change meaning", () => assert.equal(score("พ.ศ. 2569 ราคา ๒,๐๐๐", "พ.ศ.2569 ราคา ๒๐๐๐").automatedPass, true));
test("audit mode does not require reproducing all source numbers", () => assert.equal(scoreOutput({ ...spec(), mode: "audit" }, { output: "พบสำนวนที่ควรปรับ" }).automatedPass, true));
test("malformed conversion expectation fails dataset validation", () => {
  const c = { ...spec(), id: "s40-th-41", arms: ["B"], rubric: ["semantic"] };
  c.expect = { ...c.expect, skill: { none: true }, outputLanguage: "th", checks: ["Preserve values"], numberConversions: [{ from: "missing", to: "3" }] };
  assert.ok(checkDataset({ cases: [c] }, { probes: [] }, []).errors.some(e => /numberConversions/.test(e)));
});
