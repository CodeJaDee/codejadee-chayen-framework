// Hidden oracle for the runner test fixture (Step 17): copied to <workspace>/.grader/ only while grading.
import test from "node:test";
import assert from "node:assert/strict";
import { sum } from "../src/sum.mjs";

test("adds negative numbers", () => assert.equal(sum([2, -3]), -1));
test("adds mixed signs and zero", () => assert.equal(sum([-1, 0, 4]), 3));
test("all negative", () => assert.equal(sum([-2, -5]), -7));
