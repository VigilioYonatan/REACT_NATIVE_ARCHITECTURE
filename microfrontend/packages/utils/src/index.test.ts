import { describe, expect, it } from 'vitest';
import { formatCurrency } from './index';

describe('formatCurrency', () => {
  it('formats correctly', () => {
    expect(formatCurrency(100)).toBe('$100');
  });
});
