import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default teacher account
  const hashedPassword = await bcrypt.hash('teacher123', 10);
  
  const teacher = await prisma.teacher.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      name: 'Demo Teacher',
      email: 'teacher@school.com',
      passwordHash: hashedPassword,
      school: 'Demo School',
    },
  });

  console.log('Seeded teacher:', teacher.name, '| Email:', teacher.email, '| Password: teacher123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
