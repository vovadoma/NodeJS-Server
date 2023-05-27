import { afterEach, beforeEach, describe, it, test } from 'node:test';
import assert from 'node:assert';
import { logger as pino } from '../../../lib/logger.js';



test('synchronous passing test', (t) => {
  t.diagnostic('A diagnostic message');
  assert.strictEqual(1, 1, 'message');
});

test('asynchronous passing test', async () => {
  assert.strictEqual(1, 1);
});

test('skip option', { skip: true }, () => {
  pino.error({ ok: 123 });
  assert.strictEqual(1, 2);
});

describe('tests', async () => {
  beforeEach(() => pino.info('about to run a test'));
  afterEach(() => pino.info('finish'));
  it('is a subtest', () => {
    assert.strictEqual(1, 1);
  });
});
