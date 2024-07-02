import { describe, expect, test } from '@jest/globals';
import { cartController } from '../src/controllers/cart.controller';
import testling from './cart.json';

describe('Testing Cart Controller', () => {
  test('Default', async () => {
    const controller = cartController('Update', testling);
    expect(controller).toBe(1);
  });
});
