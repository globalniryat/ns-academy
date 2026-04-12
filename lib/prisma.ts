import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Singleton pattern — prevents "too many connections" during Next.js hot-reload
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const url = new URL(process.env.DATABASE_URL!)
  const pool = new Pool({
    host:     url.hostname,
    port:     parseInt(url.port || '6543'),
    database: url.pathname.replace(/^\//, ''),
    user:     decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    ssl:      { rejectUnauthorized: false },
    max:      10,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
