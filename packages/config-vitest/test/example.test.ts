import { describe, it, expect } from 'vitest';
import { add, subtract, multiply, divide, fetchData } from './example';

describe('Math utilities', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    it('should handle negative results', () => {
      expect(subtract(3, 5)).toBe(-2);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('should handle zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(multiply(-2, 3)).toBe(-6);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should handle decimals', () => {
      expect(divide(10, 3)).toBeCloseTo(3.333, 2);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
    });
  });
});

describe('Async operations', () => {
  describe('fetchData', () => {
    it('should fetch data successfully', async () => {
      const result = await fetchData('https://api.example.com');
      expect(result).toEqual({ data: 'Data from https://api.example.com' });
    });

    it('should handle different URLs', async () => {
      const result = await fetchData('https://test.com');
      expect(result.data).toContain('test.com');
    });
  });
});
