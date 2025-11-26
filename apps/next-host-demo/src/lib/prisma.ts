import { PrismaClient } from '../generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Turso configuration for production (Vercel)
const isTurso = process.env.DATABASE_URL?.startsWith('libsql://');

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
  // Add auth token for Turso in production
  ...(isTurso && process.env.TURSO_AUTH_TOKEN
    ? { authToken: process.env.TURSO_AUTH_TOKEN }
    : {}),
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
