import { is } from '@electron-toolkit/utils'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: is.dev ? ['query', 'error', 'warn'] : ['error']
  })

if (!is.dev) globalForPrisma.prisma = prisma
