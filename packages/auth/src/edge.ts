/**
 * Edge-compatible Auth Exports
 *
 * This module exports only edge-runtime compatible functions and configurations.
 * Use this import in middleware and edge runtime contexts.
 *
 * @example
 * ```ts
 * // In middleware.ts
 * import { auth } from '@repo/auth/edge';
 * ```
 */

// Auth.js Configuration (Edge-safe)
export { authConfig } from './config/auth.config';
export { auth, signIn, signOut, handlers } from './config/auth';

// Middleware (Edge-safe)
export { authMiddleware, defaultMatcher } from './middleware';

// Types (no runtime code)
export type {} from './types';
