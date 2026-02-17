// Auth.js Configuration
export { authConfig } from './config/auth.config';
export { auth, signIn, signOut, handlers } from './config/auth';
export { providers } from './config/providers';

// Permissions (CASL)
export {
  type Action,
  type Subject,
  type AppAbility,
  type UserContext,
  type UserSubject,
  type NotificationSubject,
  type SubjectType,
  defineAbilitiesFor,
  createAbility,
  subject,
} from './permissions/abilities';

export {
  getCurrentUser,
  requireAuth,
  requireRole,
  canUser,
} from './permissions/guards';

// Session Utilities
export { getSession, getUserWithAbilities } from './utils/session';

// Password Utilities
export {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
} from './utils/password';

// Token Utilities
export { generateMagicLinkToken, verifyMagicLinkToken } from './utils/token';

// Middleware
export { authMiddleware } from './middleware';

// Types
export type {} from './types';
