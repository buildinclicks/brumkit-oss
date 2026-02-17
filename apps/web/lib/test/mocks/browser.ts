/**
 * MSW Browser Setup for Browser Test Environment
 *
 * Sets up MSW browser worker for intercepting network requests in browser tests.
 * This is used when running tests in a browser environment (e.g., Playwright component tests).
 */

import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

/**
 * Create MSW browser worker with default handlers
 */
export const worker = setupWorker(...handlers);
