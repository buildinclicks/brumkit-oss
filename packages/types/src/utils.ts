/**
 * Type Utilities
 *
 * Runtime type guards and utility functions.
 */

import type { ApiErrorResponse, ApiSuccessResponse } from './api';
import type { JSONValue, Nullable } from './common';

/**
 * Check if value is null
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Check if value is undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Check if value is null or undefined
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Check if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if value is an object (not null, not array)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if value is an array
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Check if value is a function
 */
export function isFunction(
  value: unknown
): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

/**
 * Check if value is a Date
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Check if value is a Promise
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return value instanceof Promise;
}

/**
 * Check if value is an Error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Check if value is JSON serializable
 */
export function isJSONValue(value: unknown): value is JSONValue {
  if (isNullish(value)) return true;
  if (isString(value) || isNumber(value) || isBoolean(value)) return true;
  if (isArray(value)) return value.every(isJSONValue);
  if (isObject(value)) {
    return Object.values(value).every(isJSONValue);
  }
  return false;
}

/**
 * Check if API response is successful
 */
export function isApiSuccess<T>(
  response: ApiSuccessResponse<T> | ApiErrorResponse
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Check if API response is an error
 */
export function isApiError(
  response: ApiSuccessResponse<unknown> | ApiErrorResponse
): response is ApiErrorResponse {
  return response.success === false;
}

/**
 * Assert value is defined (throws if not)
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message = 'Value is null or undefined'
): asserts value is T {
  if (isNullish(value)) {
    throw new Error(message);
  }
}

/**
 * Assert value is a string (throws if not)
 */
export function assertString(
  value: unknown,
  message = 'Value is not a string'
): asserts value is string {
  if (!isString(value)) {
    throw new Error(message);
  }
}

/**
 * Assert value is a number (throws if not)
 */
export function assertNumber(
  value: unknown,
  message = 'Value is not a number'
): asserts value is number {
  if (!isNumber(value)) {
    throw new Error(message);
  }
}

/**
 * Assert condition is true (throws if false)
 */
export function assert(
  condition: boolean,
  message = 'Assertion failed'
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Unreachable code marker (for exhaustiveness checking)
 * @example
 * switch (value) {
 *   case "a": return 1;
 *   case "b": return 2;
 *   default: return assertUnreachable(value);
 * }
 */
export function assertUnreachable(value: never): never {
  throw new Error(
    `Unreachable code reached with value: ${JSON.stringify(value)}`
  );
}

/**
 * Filter out null and undefined values from array
 */
export function filterNullish<T>(array: (T | null | undefined)[]): T[] {
  return array.filter(isDefined);
}

/**
 * Convert value to nullable (null if undefined)
 */
export function toNullable<T>(value: T | undefined): Nullable<T> {
  return value === undefined ? null : value;
}

/**
 * Convert null to undefined
 */
export function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

/**
 * Get value or default if null/undefined
 */
export function getOrDefault<T>(
  value: T | null | undefined,
  defaultValue: T
): T {
  return isDefined(value) ? value : defaultValue;
}
