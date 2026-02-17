/**
 * Object Utilities
 *
 * Re-exports from lodash-es
 */

import { cloneDeep, pick as _pick, omit as _omit } from 'lodash-es';

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return cloneDeep(obj);
}

/**
 * Pick specific keys from object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return _pick(obj, keys) as Pick<T, K>;
}

/**
 * Omit specific keys from object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  return _omit(obj, keys) as Omit<T, K>;
}
