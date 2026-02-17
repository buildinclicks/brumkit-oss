/**
 * String Utilities
 *
 * Re-exports from lodash-es with additional custom utilities
 */

import {
  capitalize as _capitalize,
  camelCase as _camelCase,
  kebabCase as _kebabCase,
  snakeCase as _snakeCase,
  truncate as _truncate,
  words,
} from 'lodash-es';

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return _capitalize(str);
}

/**
 * Convert string to camelCase
 */
export function camelCase(str: string): string {
  return _camelCase(str);
}

/**
 * Convert string to kebab-case
 */
export function kebabCase(str: string): string {
  return _kebabCase(str);
}

/**
 * Convert string to snake_case
 */
export function snakeCase(str: string): string {
  return _snakeCase(str);
}

/**
 * Truncate string to specified length
 */
export function truncate(str: string, length: number, suffix = '...'): string {
  return _truncate(str, { length, omission: suffix });
}

/**
 * Check if string is empty or only whitespace
 */
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Generate random string of specified length
 */
export function randomString(length: number): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Create slug from string (URL-friendly)
 */
export function slugify(str: string): string {
  return _kebabCase(str);
}

/**
 * Remove HTML tags from string
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Count words in string
 */
export function wordCount(str: string): number {
  return words(str).length;
}
