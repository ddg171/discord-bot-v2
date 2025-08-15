import { expect, test } from 'vitest';
import { returnZero } from '../src/utils';

test('returnZero should return 0', () => {
  expect(returnZero()).toBe(0);
});
