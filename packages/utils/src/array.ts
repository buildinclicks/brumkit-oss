/**
 * Array Utilities
 *
 * Re-exports from lodash-es
 */

import {
  uniq,
  chunk as _chunk,
  shuffle as _shuffle,
  groupBy as _groupBy,
} from 'lodash-es';

/**
 * Remove duplicates from array
 */
export function unique<T>(arr: T[]): T[] {
  return uniq(arr);
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  return _chunk(arr, size);
}

/**
 * Shuffle array randomly
 */
export function shuffle<T>(arr: T[]): T[] {
  return _shuffle(arr);
}

/**
 * Group array elements by key
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return _groupBy(arr, key as string);
}
