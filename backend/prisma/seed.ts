import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const defaultUser = await prisma.user.upsert({
    where: { email: 'default@example.com' },
    update: {
      passwordHash: '$2b$10$TpzIADqpLqrMBo5s98.Dx.bsfFZL1plJquQIOsUAz5ee5z4.Jni3m',
    },
    create: {
      id: '00000000-0000-4000-8000-000000000001',
      email: 'default@example.com',
      name: 'Default User',
      passwordHash: '$2b$10$TpzIADqpLqrMBo5s98.Dx.bsfFZL1plJquQIOsUAz5ee5z4.Jni3m',
    },
  });

  const cash = await prisma.account.upsert({
    where: { id: '11111111-1111-4111-8111-111111111111' },
    update: {
      userId: defaultUser.id,
    },
    create: {
      id: '11111111-1111-4111-8111-111111111111',
      userId: defaultUser.id,
      name: 'Cash',
      type: 'CASH',
      balance: 500000,
    },
  });

  const food = await prisma.category.upsert({
    where: { id: '22222222-2222-4222-8222-222222222222' },
    update: {
      userId: defaultUser.id,
      type: TransactionType.EXPENSE,
    },
    create: {
      id: '22222222-2222-4222-8222-222222222222',
      userId: defaultUser.id,
      name: 'Food',
      type: TransactionType.EXPENSE,
      color: '#ef4444',
    },
  });

  const salary = await prisma.category.upsert({
    where: { id: '55555555-5555-4555-8555-555555555555' },
    update: {
      userId: defaultUser.id,
      type: TransactionType.INCOME,
    },
    create: {
      id: '55555555-5555-4555-8555-555555555555',
      userId: defaultUser.id,
      name: 'Salary',
      type: TransactionType.INCOME,
      color: '#2f9e7e',
    },
  });

  await prisma.category.upsert({
    where: { id: '66666666-6666-4666-8666-666666666666' },
    update: {
      userId: defaultUser.id,
      type: TransactionType.INCOME,
    },
    create: {
      id: '66666666-6666-4666-8666-666666666666',
      userId: defaultUser.id,
      name: 'Freelance',
      type: TransactionType.INCOME,
      color: '#2563eb',
    },
  });

  await prisma.category.upsert({
    where: { id: '77777777-7777-4777-8777-777777777777' },
    update: {
      userId: defaultUser.id,
      type: TransactionType.INCOME,
    },
    create: {
      id: '77777777-7777-4777-8777-777777777777',
      userId: defaultUser.id,
      name: 'Bonus',
      type: TransactionType.INCOME,
      color: '#a855f7',
    },
  });

  await prisma.transaction.upsert({
    where: { id: '33333333-3333-4333-8333-333333333333' },
    update: {},
    create: {
      id: '33333333-3333-4333-8333-333333333333',
      userId: defaultUser.id,
      type: TransactionType.EXPENSE,
      amount: 45000,
      description: 'Lunch',
      accountId: cash.id,
      categoryId: food.id,
    },
  });

  await prisma.transaction.upsert({
    where: { id: '88888888-8888-4888-8888-888888888888' },
    update: {},
    create: {
      id: '88888888-8888-4888-8888-888888888888',
      userId: defaultUser.id,
      type: TransactionType.INCOME,
      amount: 8000000,
      description: 'Monthly salary',
      accountId: cash.id,
      categoryId: salary.id,
    },
  });

  await prisma.budget.upsert({
    where: { id: '44444444-4444-4444-8444-444444444444' },
    update: {},
    create: {
      id: '44444444-4444-4444-8444-444444444444',
      userId: defaultUser.id,
      name: 'Monthly Food',
      amount: 1500000,
      startsAt: new Date('2026-04-01T00:00:00.000Z'),
      endsAt: new Date('2026-04-30T23:59:59.999Z'),
      categoryId: food.id,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
