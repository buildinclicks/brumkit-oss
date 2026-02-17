import { getSession } from 'next-auth/react';

import { ApiError, parseApiError } from './api-error';

/**
 * API client configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_TIMEOUT = 30000; // 30 seconds

/**
 * Request options for API calls
 */
interface RequestOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}

/**
 * Base API client class with common HTTP methods
 */
class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
  }

  /**
   * Build full URL from path
   */
  private buildURL(path: string): string {
    // If path starts with http:// or https://, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    // Remove leading slash from path if present
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // If no base URL, assume relative path (same origin)
    if (!this.baseURL) {
      return cleanPath;
    }

    // Combine base URL and path
    return `${this.baseURL}${cleanPath}`;
  }

  /**
   * Get authentication headers
   */
  private async getAuthHeaders(skipAuth?: boolean): Promise<HeadersInit> {
    if (skipAuth) return {};

    try {
      const session = await getSession();
      if (session?.user) {
        // If using JWT, you might want to add Bearer token here
        // For now, NextAuth handles cookies automatically
        return {};
      }
    } catch (error) {
      console.error('Failed to get session:', error);
    }

    return {};
  }

  /**
   * Make HTTP request with timeout and error handling
   */
  private async request<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      skipAuth = false,
      headers = {},
      ...fetchOptions
    } = options;

    // Build headers
    const authHeaders = await this.getAuthHeaders(skipAuth);
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    };

    // Build full URL
    const url = this.buildURL(path);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
        signal: controller.signal,
        credentials: 'include', // Include cookies for auth
      });

      clearTimeout(timeoutId);

      // Handle non-OK responses
      if (!response.ok) {
        throw await parseApiError(response);
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      // Parse JSON response
      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'server.timeout' as any);
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new ApiError(
          'Network error - please check your connection',
          0,
          'unknown.error' as any
        );
      }

      // Re-throw ApiError instances
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle unknown errors
      throw new ApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        500,
        'unknown.error' as any
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(
    path: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    path: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    path: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'DELETE',
    });
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient();

/**
 * Create custom API client with different base URL
 */
export function createApiClient(baseURL: string, timeout?: number): ApiClient {
  return new ApiClient(baseURL, timeout);
}
