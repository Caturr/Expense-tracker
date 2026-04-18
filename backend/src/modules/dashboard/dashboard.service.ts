import { Injectable } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string, query: DashboardQueryDto) {
    const occurredAt: Prisma.DateTimeFilter | undefined =
      query.from || query.to
        ? {
            gte: query.from,
            lte: query.to,
          }
        : undefined;

    const [income, expense, recentTransactions, accountCount, categoryCount, budgetCount] =
      await this.prisma.$transaction([
        this.prisma.transaction.aggregate({
          where: {
            userId,
            type: TransactionType.INCOME,
            occurredAt,
          },
          _sum: { amount: true },
        }),
        this.prisma.transaction.aggregate({
          where: {
            userId,
            type: TransactionType.EXPENSE,
            occurredAt,
          },
          _sum: { amount: true },
        }),
        this.prisma.transaction.findMany({
          where: { userId, occurredAt },
          include: {
            account: true,
            destinationAccount: true,
            category: true,
          },
          orderBy: { occurredAt: 'desc' },
          take: 10,
        }),
        this.prisma.account.count({ where: { userId } }),
        this.prisma.category.count({ where: { userId } }),
        this.prisma.budget.count({ where: { userId } }),
      ]);

    return {
      totals: {
        income: income._sum.amount ?? 0,
        expense: expense._sum.amount ?? 0,
      },
      counts: {
        accounts: accountCount,
        categories: categoryCount,
        budgets: budgetCount,
      },
      recentTransactions,
    };
  }
}
