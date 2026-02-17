/**
 * Prisma Client Singleton
 *
 * Ensures only one instance of Prisma Client exists across the application.
 * Handles Hot Module Replacement (HMR) in development.
 */

import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting database connection limit during hot reloads.
declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });
};

export const prisma = global.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Graceful shutdown
export async function disconnect() {
  await prisma.$disconnect();
}

// Connection health check
export async function healthCheck(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
