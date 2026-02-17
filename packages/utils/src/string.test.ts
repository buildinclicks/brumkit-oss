import { describe, it, expect } from 'vitest';
import {
  capitalize,
  camelCase,
  kebabCase,
  snakeCase,
  truncate,
  isEmpty,
  slugify,
  stripHtml,
  wordCount,
} from './string.js';

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('Hello-World')).toBe('helloWorld');
      expect(camelCase('hello_world')).toBe('helloWorld');
    });
  });

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
      expect(kebabCase('Hello World')).toBe('hello-world');
      expect(kebabCase('hello_world')).toBe('hello-world');
    });
  });

  describe('snakeCase', () => {
    it('should convert to snake_case', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world');
      expect(snakeCase('Hello World')).toBe('hello_world');
      expect(snakeCase('hello-world')).toBe('hello_world');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should use custom suffix', () => {
      expect(truncate('Hello World', 8, '…')).toBe('Hello W…');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' hello ')).toBe(false);
    });
  });

  describe('slugify', () => {
    it('should create URL-friendly slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Hello, World!')).toBe('hello-world');
      expect(slugify('  Hello   World  ')).toBe('hello-world');
    });
  });

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello</p>')).toBe('Hello');
      expect(stripHtml('<div><span>Hello</span> World</div>')).toBe(
        'Hello World'
      );
    });
  });

  describe('wordCount', () => {
    it('should count words', () => {
      expect(wordCount('Hello World')).toBe(2);
      expect(wordCount('  Hello   World  ')).toBe(2);
      expect(wordCount('One')).toBe(1);
    });
  });
});
