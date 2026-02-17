import { ErrorCode } from '@repo/types';

import type { ApiErrorResponse, ValidationErrorField } from '@repo/types';

/**
 * Custom API Error class with structured error information
 */
export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly fields?: ValidationErrorField[];
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
    fields?: ValidationErrorField[],
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.fields = fields;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Check if this is a validation error
   */
  isValidationError(): boolean {
    return this.code === ErrorCode.VALIDATION_FAILED && !!this.fields?.length;
  }

  /**
   * Check if this is an authentication error
   */
  isAuthError(): boolean {
    return (
      this.code === ErrorCode.AUTH_INVALID_CREDENTIALS ||
      this.code === ErrorCode.AUTH_UNAUTHORIZED ||
      this.code === ErrorCode.AUTH_TOKEN_EXPIRED ||
      this.code === ErrorCode.AUTH_TOKEN_INVALID
    );
  }

  /**
   * Get validation error for a specific field
   */
  getFieldError(fieldName: string): string | undefined {
    return this.fields?.find((f) => f.field === fieldName)?.message;
  }

  /**
   * Get all validation errors as a map
   */
  getFieldErrors(): Record<string, string> {
    if (!this.fields) return {};
    return this.fields.reduce(
      (acc, field) => {
        acc[field.field] = field.message;
        return acc;
      },
      {} as Record<string, string>
    );
  }
}

/**
 * Parse API error response and create ApiError instance
 */
export async function parseApiError(response: Response): Promise<ApiError> {
  const statusCode = response.status;
  let errorData: ApiErrorResponse | undefined;

  try {
    errorData = await response.json();
  } catch {
    // If response is not JSON, create generic error
    return new ApiError(
      response.statusText || 'An error occurred',
      statusCode,
      ErrorCode.UNKNOWN_ERROR
    );
  }

  if (errorData && 'error' in errorData) {
    const { error } = errorData;
    const fields =
      'fields' in error && Array.isArray(error.fields)
        ? error.fields
        : undefined;

    return new ApiError(
      error.message,
      statusCode,
      error.code as ErrorCode,
      fields,
      error.details
    );
  }

  // Fallback for non-standard error responses
  return new ApiError(
    (errorData as { message?: string })?.message || 'An error occurred',
    statusCode,
    ErrorCode.UNKNOWN_ERROR
  );
}

/**
 * Check if an error is an ApiError instance
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}

/**
 * Format validation errors for form display
 */
export function formatValidationErrors(
  error: unknown
): Record<string, string> | null {
  if (isApiError(error) && error.isValidationError()) {
    return error.getFieldErrors();
  }
  return null;
}
