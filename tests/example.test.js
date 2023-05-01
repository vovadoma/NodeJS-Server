import { afterEach, beforeEach, describe, it, test } from "node:test";
import assert from 'node:assert';


test('synchronous passing test', (t) => {
  assert.strictEqual(1, 1);
});

test('asynchronous passing test', async (t) => {
  assert.strictEqual(1, 1);
});

test('skip option', { skip: true }, (t) => {
  assert.strictEqual(1, 2);
});

describe('tests', async () => {
  beforeEach(() => console.log('about to run a test'));
  it('is a subtest', () => {
    assert.strictEqual(1, 1);
  });
});