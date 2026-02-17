import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@repo/database';
import NextAuth from 'next-auth';

import { authConfig } from './auth.config';
import { providers } from './providers';

import type { UserRole } from '@prisma/client';
import type { NextAuthConfig } from 'next-auth';

const config = {
  ...authConfig,
  // Type assertion needed due to minor version mismatch in @auth/core dependency
  // between next-auth and @auth/prisma-adapter
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id ?? '';
        token.role = (user.role as UserRole) ?? 'USER';
        token.username = user.username ?? null;
      }

      // Update session
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = (token.id as string) ?? '';
        session.user.role = (token.role as UserRole) ?? 'USER';
        session.user.username = (token.username as string | null) ?? null;
      }

      return session;
    },
    ...authConfig.callbacks,
  },
  events: {
    async createUser({ user }) {
      console.log('✅ User created:', user.email);
    },
    async signIn({ user, isNewUser }) {
      console.log('✅ User signed in:', user.email, isNewUser ? '(new)' : '');
    },
    async signOut(params) {
      const token = 'token' in params ? params.token : null;
      console.log('👋 User signed out:', token?.email);
    },
  },
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig;

const nextAuth = NextAuth(config);

export const handlers = nextAuth.handlers;
export const auth = nextAuth.auth;
export const signIn: typeof nextAuth.signIn = nextAuth.signIn;
export const signOut: typeof nextAuth.signOut = nextAuth.signOut;
