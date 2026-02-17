/**
 * Authentication Types
 *
 * Types for authentication, authorization, and user management.
 */

import type { Email, ID, Timestamp, UserId } from './common';

/**
 * User role
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

/**
 * Permission action
 */
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

/**
 * Permission resource
 */
export enum PermissionResource {
  USER = 'user',
  ARTICLE = 'article',
  COMMENT = 'comment',
  TAG = 'tag',
  SETTINGS = 'settings',
}

/**
 * Permission definition
 */
export interface Permission {
  action: PermissionAction;
  resource: PermissionResource;
  conditions?: Record<string, unknown>;
}

/**
 * Authentication provider
 */
export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  GITHUB = 'github',
  MAGIC_LINK = 'magic_link',
}

/**
 * Session data
 */
export interface Session {
  id: ID;
  userId: UserId;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * User profile data
 */
export interface UserProfile {
  id: UserId;
  email: Email;
  name: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Authenticated user (with session)
 */
export interface AuthenticatedUser extends UserProfile {
  session: Session;
  permissions: Permission[];
}

/**
 * Login credentials (email/password)
 */
export interface LoginCredentials {
  email: Email;
  password: string;
}

/**
 * Registration data
 */
export interface RegistrationData {
  email: Email;
  password: string;
  name: string;
}

/**
 * OAuth callback data
 */
export interface OAuthCallbackData {
  provider: AuthProvider;
  code: string;
  state?: string;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: Email;
}

/**
 * Password reset confirmation
 */
export interface PasswordResetConfirmation {
  token: string;
  newPassword: string;
}

/**
 * Email verification
 */
export interface EmailVerification {
  token: string;
}

/**
 * Magic link request
 */
export interface MagicLinkRequest {
  email: Email;
  redirectTo?: string;
}

/**
 * Access token
 */
export interface AccessToken {
  token: string;
  expiresIn: number;
  type: 'Bearer';
}

/**
 * Refresh token
 */
export interface RefreshToken {
  token: string;
  expiresIn: number;
}

/**
 * Token pair
 */
export interface TokenPair {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
}

/**
 * Auth tokens response
 */
export interface AuthTokensResponse {
  user: UserProfile;
  tokens: TokenPair;
}
