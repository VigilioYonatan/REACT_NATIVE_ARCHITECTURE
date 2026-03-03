import { describe, expect, it } from 'vitest';
import { Button } from './index';

describe('ui-kit', () => {
  it('Button exists', () => {
    expect(typeof Button).toBe('function');
  });
});
