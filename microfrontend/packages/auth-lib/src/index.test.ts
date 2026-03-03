import { describe, expect, it } from 'vitest';
import { login } from './index';

describe('auth-lib', () => {
  it('login exists', () => {
    expect(typeof login).toBe('function');
  });
});
