import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // TODO: Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@saas-ticketing.com' },
    update: {},
    create: {
      email: 'admin@saas-ticketing.com',
      password: adminPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      emailVerified: true,
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // TODO: Create test freelance user
  const freelancePassword = await bcrypt.hash('test123', 10);
  const freelance = await prisma.user.upsert({
    where: { email: 'freelance@test.com' },
    update: {},
    create: {
      email: 'freelance@test.com',
      password: freelancePassword,
      role: 'freelance',
      firstName: 'Test',
      lastName: 'Freelance',
      emailVerified: true,
    },
  });

  console.log('✅ Created freelance user:', freelance.email);

  // TODO: Create test organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Test Agency',
      type: 'agency',
      users: {
        connect: { id: freelance.id },
      },
    },
  });

  console.log('✅ Created organization:', organization.name);

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

