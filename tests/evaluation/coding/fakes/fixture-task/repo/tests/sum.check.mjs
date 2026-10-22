import test from "node:test";
import assert from "node:assert/strict";
import { sum } from "../src/sum.mjs";

test("adds positive numbers", () => assert.equal(sum([1, 2, 3]), 6));
test("adds negative numbers", () => assert.equal(sum([2, -3]), -1));
test("an empty list is 0", () => assert.equal(sum([]), 0));
