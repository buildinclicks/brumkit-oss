import { describe, it, expect } from 'vitest';
import {
  isNull,
  isUndefined,
  isNullish,
  isDefined,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isFunction,
  isDate,
  isPromise,
  isError,
  isJSONValue,
  isApiSuccess,
  isApiError,
  filterNullish,
  toNullable,
  nullToUndefined,
  getOrDefault,
  assertDefined,
  assertString,
  assertNumber,
  assert,
  assertUnreachable,
} from './utils.js';
import type { ApiErrorResponse, ApiSuccessResponse } from './api.js';

describe('Type Guards', () => {
  describe('isNull', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBe(true);
    });

    it('should return false for non-null values', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull('')).toBe(false);
      expect(isNull(false)).toBe(false);
    });
  });

  describe('isUndefined', () => {
    it('should return true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it('should return false for non-undefined values', () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined('')).toBe(false);
    });
  });

  describe('isNullish', () => {
    it('should return true for null and undefined', () => {
      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
    });

    it('should return false for other values', () => {
      expect(isNullish(0)).toBe(false);
      expect(isNullish('')).toBe(false);
      expect(isNullish(false)).toBe(false);
    });
  });

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined({})).toBe(true);
    });

    it('should return false for null and undefined', () => {
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(true)).toBe(false);
      expect(isString(null)).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-1.5)).toBe(true);
    });

    it('should return false for NaN', () => {
      expect(isNumber(NaN)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(true)).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it('should return false for non-booleans', () => {
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean('true')).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isObject([])).toBe(false);
    });

    it('should return false for primitives', () => {
      expect(isObject('string')).toBe(false);
      expect(isObject(123)).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false);
      expect(isArray('array')).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function () {})).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction('function')).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should return true for valid dates', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date('2024-01-01'))).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(isDate(new Date('invalid'))).toBe(false);
    });

    it('should return false for non-dates', () => {
      expect(isDate('2024-01-01')).toBe(false);
      expect(isDate(123456789)).toBe(false);
    });
  });

  describe('isPromise', () => {
    it('should return true for promises', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(new Promise(() => {}))).toBe(true);
    });

    it('should return false for non-promises', () => {
      expect(isPromise({})).toBe(false);
      expect(isPromise(() => {})).toBe(false);
    });
  });

  describe('isError', () => {
    it('should return true for errors', () => {
      expect(isError(new Error())).toBe(true);
      expect(isError(new TypeError())).toBe(true);
    });

    it('should return false for non-errors', () => {
      expect(isError({ message: 'error' })).toBe(false);
      expect(isError('error')).toBe(false);
    });
  });

  describe('isJSONValue', () => {
    it('should return true for JSON-serializable values', () => {
      expect(isJSONValue(null)).toBe(true);
      expect(isJSONValue('string')).toBe(true);
      expect(isJSONValue(123)).toBe(true);
      expect(isJSONValue(true)).toBe(true);
      expect(isJSONValue([])).toBe(true);
      expect(isJSONValue({})).toBe(true);
      expect(isJSONValue({ a: 1, b: 'two' })).toBe(true);
    });

    it('should return false for non-JSON values', () => {
      expect(isJSONValue(undefined)).toBe(true); // undefined is handled
      expect(isJSONValue(() => {})).toBe(false);
      expect(isJSONValue(Symbol('test'))).toBe(false);
    });
  });
});

describe('API Type Guards', () => {
  describe('isApiSuccess', () => {
    it('should return true for success responses', () => {
      const response: ApiSuccessResponse<string> = {
        success: true,
        data: 'test',
      };
      expect(isApiSuccess(response)).toBe(true);
    });

    it('should return false for error responses', () => {
      const response: ApiErrorResponse = {
        success: false,
        error: { code: 'ERROR', message: 'Test error' },
      };
      expect(isApiSuccess(response)).toBe(false);
    });
  });

  describe('isApiError', () => {
    it('should return true for error responses', () => {
      const response: ApiErrorResponse = {
        success: false,
        error: { code: 'ERROR', message: 'Test error' },
      };
      expect(isApiError(response)).toBe(true);
    });

    it('should return false for success responses', () => {
      const response: ApiSuccessResponse<string> = {
        success: true,
        data: 'test',
      };
      expect(isApiError(response)).toBe(false);
    });
  });
});

describe('Assertion Functions', () => {
  describe('assertDefined', () => {
    it('should not throw for defined values', () => {
      expect(() => assertDefined(0)).not.toThrow();
      expect(() => assertDefined('test')).not.toThrow();
    });

    it('should throw for null and undefined', () => {
      expect(() => assertDefined(null)).toThrow();
      expect(() => assertDefined(undefined)).toThrow();
    });
  });

  describe('assertString', () => {
    it('should not throw for strings', () => {
      expect(() => assertString('test')).not.toThrow();
    });

    it('should throw for non-strings', () => {
      expect(() => assertString(123)).toThrow();
      expect(() => assertString(true)).toThrow();
    });
  });

  describe('assertNumber', () => {
    it('should not throw for numbers', () => {
      expect(() => assertNumber(123)).not.toThrow();
    });

    it('should throw for non-numbers', () => {
      expect(() => assertNumber('123')).toThrow();
      expect(() => assertNumber(NaN)).toThrow();
    });
  });

  describe('assert', () => {
    it('should not throw for true conditions', () => {
      expect(() => assert(true)).not.toThrow();
      expect(() => assert(1 === 1)).not.toThrow();
    });

    it('should throw for false conditions', () => {
      expect(() => assert(false)).toThrow();
      expect(() => assert(1 === 2)).toThrow();
    });
  });

  describe('assertUnreachable', () => {
    it('should throw with value information', () => {
      const value = 'test' as never;
      expect(() => assertUnreachable(value)).toThrow('test');
    });
  });
});

describe('Utility Functions', () => {
  describe('filterNullish', () => {
    it('should filter out null and undefined', () => {
      const array = [1, null, 2, undefined, 3];
      expect(filterNullish(array)).toEqual([1, 2, 3]);
    });

    it('should keep zero and false', () => {
      const array = [0, false, null, undefined, ''];
      expect(filterNullish(array)).toEqual([0, false, '']);
    });
  });

  describe('toNullable', () => {
    it('should convert undefined to null', () => {
      expect(toNullable(undefined)).toBe(null);
    });

    it('should keep other values unchanged', () => {
      expect(toNullable('test')).toBe('test');
      expect(toNullable(null)).toBe(null);
    });
  });

  describe('nullToUndefined', () => {
    it('should convert null to undefined', () => {
      expect(nullToUndefined(null)).toBe(undefined);
    });

    it('should keep other values unchanged', () => {
      expect(nullToUndefined('test')).toBe('test');
      expect(nullToUndefined(undefined)).toBe(undefined);
    });
  });

  describe('getOrDefault', () => {
    it('should return value if defined', () => {
      expect(getOrDefault('test', 'default')).toBe('test');
      expect(getOrDefault(0, 10)).toBe(0);
    });

    it('should return default for null and undefined', () => {
      expect(getOrDefault(null, 'default')).toBe('default');
      expect(getOrDefault(undefined, 'default')).toBe('default');
    });
  });
});
