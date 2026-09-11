import { PrismaClient } from '@prisma/client';
import { localDb } from '../../db/index';

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

const isLocalDataSource = process.env.DATA_SOURCE === 'local' || !process.env.DATABASE_URL;

function createDbClient(): any {
  if (isLocalDataSource) {
    console.log('📁 Using local database folder (db/) for data fetching');
    return localDb;
  }
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createDbClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
export * from '../../db/index';

