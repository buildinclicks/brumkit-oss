/**
 * MSW Server Setup for Node.js Test Environment
 *
 * Sets up MSW server for intercepting network requests in tests.
 * This is used in Vitest Node.js environment.
 */

import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/**
 * Create MSW server with default handlers
 */
export const server = setupServer(...handlers);
