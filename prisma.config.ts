import { defineConfig } from 'prisma/config'

export default defineConfig({
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'ts-node --project tsconfig.seed.json prisma/seed.ts',
  },
})
