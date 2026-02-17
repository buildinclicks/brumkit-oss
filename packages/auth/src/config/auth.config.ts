import type { NextAuthConfig } from 'next-auth';

/**
 * Base Auth.js configuration
 * This config is used both on Edge and Node.js runtimes
 */
export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      if (isOnDashboard || isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
  },
  providers: [], // Providers are added in auth.ts
} satisfies NextAuthConfig;
