import { returnZero } from '@/utils';
import { expect, test } from 'vitest';

test('returnZero should return 0', () => {
  expect(returnZero()).toBe(0);
});
