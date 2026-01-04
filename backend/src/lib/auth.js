import { betterAuth } from 'better-auth';
import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';

// Create Kysely instance for Better Auth
const db = new Kysely({
  dialect: new MysqlDialect({
    pool: createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'si_film_archive'
    })
  })
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  basePath: '/api/auth',
  database: {
    db,
    type: 'mysql'
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
      redirectURI: `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`
    }
  },
  user: {
    modelName: 'users',
    additionalFields: {
      role_id: {
        type: 'number',
        defaultValue: 1,
        input: false
      }
    }
  },
  session: {
    modelName: 'sessions',
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24
  },
  account: {
    modelName: 'accounts'
  },
  verification: {
    modelName: 'verifications'
  },
  advanced: {
    generateId: () => crypto.randomUUID(),
    crossSubDomainCookies: {
      enabled: false
    }
  },
  trustedOrigins: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000']
});
