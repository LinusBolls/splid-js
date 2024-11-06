import { describe, expect, it } from 'vitest';
import { getBalance } from './getBalance';

describe('getBalance', () => {
  it('handles empty input', () => {
    expect(getBalance([], [])).toEqual({});
  });
});
