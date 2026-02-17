/**
 * API Types
 *
 * Types for API requests, responses, and errors.
 */

import type { JSONObject } from './common';

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * HTTP status codes
 */
export type HttpStatusCode =
  | 200 // OK
  | 201 // Created
  | 204 // No Content
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 409 // Conflict
  | 422 // Unprocessable Entity
  | 429 // Too Many Requests
  | 500 // Internal Server Error
  | 502 // Bad Gateway
  | 503; // Service Unavailable

/**
 * API success response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: JSONObject;
    stack?: string; // Only in development
  };
}

/**
 * API response (success or error)
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Validation error field
 */
export interface ValidationErrorField {
  field: string;
  message: string;
  code: string;
}

/**
 * Validation error response
 */
export interface ValidationErrorResponse extends ApiErrorResponse {
  error: ApiErrorResponse['error'] & {
    fields: ValidationErrorField[];
  };
}

/**
 * API request config
 */
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;
}

/**
 * API client error
 */
export class ApiError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public code: string,
    message: string,
    public details?: JSONObject
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Error codes enum
 */
export enum ErrorCode {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS = 'auth.invalid_credentials',
  AUTH_TOKEN_EXPIRED = 'auth.token_expired',
  AUTH_TOKEN_INVALID = 'auth.token_invalid',
  AUTH_UNAUTHORIZED = 'auth.unauthorized',
  AUTH_FORBIDDEN = 'auth.forbidden',

  // Validation errors
  VALIDATION_FAILED = 'validation.failed',
  VALIDATION_INVALID_EMAIL = 'validation.invalid_email',
  VALIDATION_INVALID_PASSWORD = 'validation.invalid_password',
  VALIDATION_REQUIRED_FIELD = 'validation.required_field',

  // Resource errors
  RESOURCE_NOT_FOUND = 'resource.not_found',
  RESOURCE_ALREADY_EXISTS = 'resource.already_exists',
  RESOURCE_CONFLICT = 'resource.conflict',

  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'rate_limit.exceeded',

  // Server errors
  SERVER_ERROR = 'server.internal_error',
  SERVER_UNAVAILABLE = 'server.unavailable',
  SERVER_TIMEOUT = 'server.timeout',

  // Database errors
  DATABASE_ERROR = 'database.error',
  DATABASE_CONNECTION_FAILED = 'database.connection_failed',

  // Unknown
  UNKNOWN_ERROR = 'unknown.error',
}
