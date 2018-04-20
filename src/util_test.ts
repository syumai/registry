/*!
   Copyright 2018 Propel http://propel.site/.  All rights reserved.
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

import { test } from "../tools/tester";
import { assert, assertEqual } from "./util";
import * as util from "./util";

test(async function util_equal() {
  assert(util.equal("world", "world"));
  assert(!util.equal("hello", "world"));
  assert(util.equal(5, 5));
  assert(!util.equal(5, 6));
  assert(util.equal(NaN, NaN));
  assert(util.equal({ hello: "world" }, { hello: "world" }));
  assert(!util.equal({ world: "hello" }, { hello: "world" }));
  assert(util.equal({ hello: "world", hi: { there: "everyone" } },
                    { hello: "world", hi: { there: "everyone" } }));
  assert(!util.equal({ hello: "world", hi: { there: "everyone" } },
                    { hello: "world", hi: { there: "everyone else" } }));
});

test(async function util_counterMap() {
  const m = new util.CounterMap();
  assertEqual(m.get(0), 0);
  m.inc(0);
  m.inc(0);
  assertEqual(m.get(0), 2);
  assertEqual(m.get(1), 0);
  m.inc(1);
  assertEqual(m.get(1), 1);
  m.dec(0);
  m.inc(1);
  assertEqual(m.get(0), 1);
  assertEqual(m.get(1), 2);
  const k = m.keys();
  console.log(k);
});

test(async function util_deepCloneArray() {
  const arr1 = [[1, 2], [3, 4]];
  const arr2 = util.deepCloneArray(arr1);
  // Verify that arrays have different identity.
  assert(arr1 !== arr2);
  assert(arr1[0] !== arr2[0]);
  assert(arr1[1] !== arr2[1]);
  // Verify that primitives inside the array have the same value.
  assertEqual(arr1[0][0], arr2[0][0]);
  assertEqual(arr1[1][0], arr2[1][0]);
  assertEqual(arr1[0][1], arr2[0][1]);
  assertEqual(arr1[1][1], arr2[1][1]);
});

test(async function util_randomString() {
  const seen = new Set<string>();
  for (let i = 0; i < 100; i++) {
    const s = util.randomString();
    assertEqual(s.length, 10, "should be 10 chars long");
    assert(/^[a-z0-9]+$/.test(s), "should contain letters and numbers only");
    assert(!seen.has(s), "should be unique");
    seen.add(s);
  }
});

test(async function util_isNumericalKey() {
  assertEqual(util.isNumericalKey("0"), true);
  assertEqual(util.isNumericalKey("1"), true);
  assertEqual(util.isNumericalKey("1000"), true);
  assertEqual(util.isNumericalKey("4294967294"), true); // Max allowed.
  assertEqual(util.isNumericalKey("4294967295"), false); // Out of range.
  assertEqual(util.isNumericalKey("-1"), false);
  assertEqual(util.isNumericalKey("00"), false);
  assertEqual(util.isNumericalKey("01"), false);
  assertEqual(util.isNumericalKey("0.000001"), false);
  assertEqual(util.isNumericalKey("0 "), false);
  assertEqual(util.isNumericalKey(" 2"), false);
  assertEqual(util.isNumericalKey("1a"), false);
  assertEqual(util.isNumericalKey("text"), false);
  assertEqual(util.isNumericalKey("false"), false);
  assertEqual(util.isNumericalKey(""), false);
});

test(async function util_captureStackTrace() {
  const s = util.captureStackTrace();
  assert(/util_captureStackTrace/.test(s));
});

test(async function util_formatImageName() {
  assertEqual(util.formatImageName("a"), "a.png");
  assertEqual(util.formatImageName("a.png"), "a.png");
  assertEqual(util.formatImageName("a.jpg"), "a.jpg");
  assertEqual(util.formatImageName("a.png.jpg"), "a.png.jpg");
  assertEqual(util.formatImageName("a", 1), "a-1.png");
  assertEqual(util.formatImageName("a.jpg", 2), "a-2.jpg");
  assertEqual(util.formatImageName("a.jpeg", 3), "a-3.jpeg");
  assertEqual(util.formatImageName("name with spaces and /@!#$", 2),
    "name with spaces and /@!#$-2.png");
  const name = util.formatImageName(undefined, 5);
  assert(name.startsWith("propel-"));
  assert(name.endsWith("-5.png"));
});
