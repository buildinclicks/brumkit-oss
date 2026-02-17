import { NextResponse } from 'next/server';

import { auth } from './config/auth';

import type { NextRequest } from 'next/server';

export interface AuthMiddlewareConfig {
  /**
   * Public routes that don't require authentication
   * @example ['/login', '/register', '/']
   */
  publicRoutes?: string[];

  /**
   * Routes that require authentication
   * @example ['/dashboard', '/profile']
   */
  protectedRoutes?: string[];

  /**
   * Routes that require admin role
   * @example ['/admin']
   */
  adminRoutes?: string[];

  /**
   * Routes that require moderator role or higher
   * @example ['/moderate']
   */
  moderatorRoutes?: string[];

  /**
   * Redirect path for unauthenticated users
   * @default '/login'
   */
  loginPath?: string;

  /**
   * Redirect path for unauthorized users (insufficient permissions)
   * @default '/unauthorized'
   */
  unauthorizedPath?: string;

  /**
   * Callback URL parameter name
   * @default 'callbackUrl'
   */
  callbackUrlParam?: string;
}

const defaultConfig: Required<AuthMiddlewareConfig> = {
  publicRoutes: ['/login', '/register', '/'],
  protectedRoutes: ['/dashboard'],
  adminRoutes: ['/admin'],
  moderatorRoutes: ['/moderate'],
  loginPath: '/login',
  unauthorizedPath: '/unauthorized',
  callbackUrlParam: 'callbackUrl',
};

/**
 * Check if a path matches a route pattern
 */
function matchesRoute(path: string, route: string): boolean {
  // Exact match
  if (path === route) return true;

  // Wildcard match (e.g., /admin/*)
  if (route.endsWith('/*')) {
    const base = route.slice(0, -2);
    return path.startsWith(base);
  }

  // Prefix match (e.g., /dashboard)
  if (path.startsWith(route + '/')) return true;

  return false;
}

/**
 * Check if a path is in a list of routes
 */
function isInRoutes(path: string, routes: string[]): boolean {
  return routes.some((route) => matchesRoute(path, route));
}

/**
 * Create Auth.js middleware for Next.js
 */
export function authMiddleware(config: AuthMiddlewareConfig = {}) {
  const cfg = { ...defaultConfig, ...config };

  return async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if route is public
    if (isInRoutes(path, cfg.publicRoutes)) {
      return NextResponse.next();
    }

    // Get session
    const session = await auth();
    const isAuthenticated = !!session?.user;

    // Check if route requires authentication
    if (
      isInRoutes(path, cfg.protectedRoutes) ||
      isInRoutes(path, cfg.adminRoutes) ||
      isInRoutes(path, cfg.moderatorRoutes)
    ) {
      if (!isAuthenticated) {
        // Redirect to login with callback URL
        const loginUrl = new URL(cfg.loginPath, request.url);
        loginUrl.searchParams.set(cfg.callbackUrlParam, path);
        return NextResponse.redirect(loginUrl);
      }

      // Check admin routes
      if (isInRoutes(path, cfg.adminRoutes)) {
        const role = session.user.role;
        if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
          return NextResponse.redirect(
            new URL(cfg.unauthorizedPath, request.url)
          );
        }
      }

      // Check moderator routes
      if (isInRoutes(path, cfg.moderatorRoutes)) {
        const role = session.user.role;
        if (
          role !== 'MODERATOR' &&
          role !== 'ADMIN' &&
          role !== 'SUPER_ADMIN'
        ) {
          return NextResponse.redirect(
            new URL(cfg.unauthorizedPath, request.url)
          );
        }
      }
    }

    return NextResponse.next();
  };
}

/**
 * Matcher configuration for Next.js middleware
 * Add this to your middleware.ts:
 *
 * export const config = {
 *   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
 * };
 */
export const defaultMatcher = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
