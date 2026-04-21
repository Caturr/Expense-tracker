import { Injectable } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ReportQueryDto } from './dto/report-query.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getExpenseByCategory(userId: string, query: ReportQueryDto) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: TransactionType.EXPENSE,
        occurredAt: this.getOccurredAtFilter(query),
      },
      select: {
        amount: true,
        categoryId: true,
        category: {
          select: {
            name: true,
            color: true,
          },
        },
      },
    });

    const totals = new Map<
      string,
      { categoryId: string | null; categoryName: string; categoryColor: string | null; amount: number }
    >();

    for (const transaction of transactions) {
      const key = transaction.categoryId ?? 'uncategorized';
      const current =
        totals.get(key) ??
        {
          categoryId: transaction.categoryId,
          categoryName: transaction.category?.name ?? 'Uncategorized',
          categoryColor: transaction.category?.color ?? null,
          amount: 0,
        };

      current.amount += Number(transaction.amount);
      totals.set(key, current);
    }

    return Array.from(totals.values()).sort((a, b) => b.amount - a.amount);
  }

  async getExpenseByAccount(userId: string, query: ReportQueryDto) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: TransactionType.EXPENSE,
        occurredAt: this.getOccurredAtFilter(query),
      },
      select: {
        amount: true,
        accountId: true,
        account: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });

    const totals = new Map<
      string,
      { accountId: string; accountName: string; accountType: string; amount: number }
    >();

    for (const transaction of transactions) {
      const current =
        totals.get(transaction.accountId) ??
        {
          accountId: transaction.accountId,
          accountName: transaction.account.name,
          accountType: transaction.account.type,
          amount: 0,
        };

      current.amount += Number(transaction.amount);
      totals.set(transaction.accountId, current);
    }

    return Array.from(totals.values()).sort((a, b) => b.amount - a.amount);
  }

  async getIncomeExpenseTrend(userId: string, query: ReportQueryDto) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: { in: [TransactionType.INCOME, TransactionType.EXPENSE] },
        occurredAt: this.getOccurredAtFilter(query),
      },
      select: {
        amount: true,
        type: true,
        occurredAt: true,
      },
      orderBy: { occurredAt: 'asc' },
    });

    const totals = new Map<string, { date: string; income: number; expense: number; net: number }>();

    for (const transaction of transactions) {
      const date = transaction.occurredAt.toISOString().slice(0, 10);
      const current = totals.get(date) ?? { date, income: 0, expense: 0, net: 0 };
      const amount = Number(transaction.amount);

      if (transaction.type === TransactionType.INCOME) {
        current.income += amount;
      } else {
        current.expense += amount;
      }

      current.net = current.income - current.expense;
      totals.set(date, current);
    }

    return Array.from(totals.values());
  }

  private getOccurredAtFilter(query: ReportQueryDto): Prisma.DateTimeFilter | undefined {
    if (!query.from && !query.to) {
      return undefined;
    }

    return {
      gte: query.from,
      lte: query.to,
    };
  }
}
