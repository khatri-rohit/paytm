// Import the generated Prisma client directly to avoid @prisma/client init issues during build
import { PrismaClient } from "./generated/prisma/index.js";

const globalForPrisma = global as unknown as { prisma: PrismaClient; };

export const prisma =
    globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;