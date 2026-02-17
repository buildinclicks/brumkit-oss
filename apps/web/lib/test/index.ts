/**
 * Test Utilities and Mocks
 *
 * Centralized exports for all testing utilities, custom render functions,
 * and MSW mocks.
 */

// Custom render with providers
export * from './render';

// MSW mocks - only export server for Node.js environment
export { server } from './mocks/server';
export { handlers, mockUser, mockArticle, mockTag } from './mocks/handlers';

// Re-export MSW for convenience
export { http, HttpResponse } from 'msw';
