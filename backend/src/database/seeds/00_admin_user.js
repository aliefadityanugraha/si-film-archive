import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(password, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}

export async function seed(knex) {
  // Check if admin already exists
  const existingAdmin = await knex('users').where('email', 'admin@cinearchive.com').first();
  
  if (existingAdmin) {
    console.log('Admin user already exists, updating role to admin...');
    await knex('users').where('email', 'admin@cinearchive.com').update({ role_id: 4 });
    return;
  }

  const userId = crypto.randomUUID();
  const hashedPassword = await hashPassword('admin123');

  // Insert admin user
  await knex('users').insert({
    id: userId,
    email: 'admin@cinearchive.com',
    name: 'Admin CineArchive',
    emailVerified: true,
    role_id: 4 // admin role
  });

  // Insert account with password (credential provider format)
  await knex('accounts').insert({
    id: crypto.randomUUID(),
    userId: userId,
    accountId: userId,
    providerId: 'credential',
    password: hashedPassword
  });

  console.log('✅ Admin user created:');
  console.log('   Email: admin@cinearchive.com');
  console.log('   Password: admin123');
}
