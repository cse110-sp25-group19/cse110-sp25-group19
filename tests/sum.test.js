import { jest } from '@jest/globals';
import { sum } from '../src/js/sum.js';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
