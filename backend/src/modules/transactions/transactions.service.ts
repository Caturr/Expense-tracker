import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: TransactionQueryDto) {
    const { page, limit, type, accountId, categoryId, from, to } = query;
    const where: Prisma.TransactionWhereInput = {
      userId,
      type,
      accountId,
      categoryId,
      occurredAt:
        from || to
          ? {
              gte: from,
              lte: to,
            }
          : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        include: {
          account: true,
          destinationAccount: true,
          category: true,
        },
        orderBy: { occurredAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  findOne(userId: string, id: string) {
    return this.prisma.transaction.findFirstOrThrow({
      where: { id, userId },
      include: {
        account: true,
        destinationAccount: true,
        category: true,
      },
    });
  }

  create(userId: string, createTransactionDto: CreateTransactionDto) {
    return this.prisma.$transaction(async (tx) => {
      this.validateTransactionAccounts(createTransactionDto);
      const transaction = await tx.transaction.create({
        data: this.getCreateTransactionData(userId, createTransactionDto),
      });

      await this.applyAccountBalanceChange(tx, transaction);

      return transaction;
    });
  }

  update(userId: string, id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.prisma.$transaction(async (tx) => {
      const previousTransaction = await tx.transaction.findFirstOrThrow({
        where: { id, userId },
      });

      await this.revertAccountBalanceChange(tx, previousTransaction);

      const nextTransaction = {
        type: updateTransactionDto.type ?? previousTransaction.type,
        accountId: updateTransactionDto.accountId ?? previousTransaction.accountId,
        destinationAccountId:
          updateTransactionDto.destinationAccountId ??
          previousTransaction.destinationAccountId ??
          undefined,
      };
      this.validateTransactionAccounts(nextTransaction);

      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data: this.getUpdateTransactionData(updateTransactionDto, previousTransaction.type),
      });

      await this.applyAccountBalanceChange(tx, updatedTransaction);

      return updatedTransaction;
    });
  }

  remove(userId: string, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const existingTransaction = await tx.transaction.findFirstOrThrow({
        where: { id, userId },
      });
      const deletedTransaction = await tx.transaction.delete({
        where: { id: existingTransaction.id },
      });

      await this.revertAccountBalanceChange(tx, deletedTransaction);

      return deletedTransaction;
    });
  }

  private async applyAccountBalanceChange(
    tx: Prisma.TransactionClient,
    transaction: BalanceTransaction,
  ) {
    if (transaction.type === TransactionType.TRANSFER) {
      if (!transaction.destinationAccountId) {
        throw new BadRequestException('Transfer requires a destination account.');
      }

      await tx.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            decrement: transaction.amount,
          },
        },
      });
      await tx.account.update({
        where: { id: transaction.destinationAccountId },
        data: {
          balance: {
            increment: transaction.amount,
          },
        },
      });
      return;
    }

    await tx.account.update({
      where: { id: transaction.accountId },
      data: {
        balance: {
          increment: this.getBalanceDelta(transaction.type, transaction.amount),
        },
      },
    });
  }

  private async revertAccountBalanceChange(
    tx: Prisma.TransactionClient,
    transaction: BalanceTransaction,
  ) {
    if (transaction.type === TransactionType.TRANSFER) {
      if (!transaction.destinationAccountId) {
        throw new BadRequestException('Transfer requires a destination account.');
      }

      await tx.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            increment: transaction.amount,
          },
        },
      });
      await tx.account.update({
        where: { id: transaction.destinationAccountId },
        data: {
          balance: {
            decrement: transaction.amount,
          },
        },
      });
      return;
    }

    await tx.account.update({
      where: { id: transaction.accountId },
      data: {
        balance: {
          decrement: this.getBalanceDelta(transaction.type, transaction.amount),
        },
      },
    });
  }

  private getCreateTransactionData(
    userId: string,
    data: CreateTransactionDto,
  ): Prisma.TransactionUncheckedCreateInput {
    if (data.type === TransactionType.TRANSFER) {
      return {
        ...data,
        userId,
        categoryId: null,
      };
    }

    return {
      ...data,
      userId,
      destinationAccountId: null,
    };
  }

  private getUpdateTransactionData(
    data: UpdateTransactionDto,
    currentType: TransactionType,
  ): Prisma.TransactionUncheckedUpdateInput {
    const nextType = data.type ?? currentType;

    if (nextType === TransactionType.TRANSFER) {
      return {
        ...data,
        categoryId: null,
      };
    }

    return {
      ...data,
      destinationAccountId: null,
    };
  }

  private validateTransactionAccounts(transaction: {
    type: TransactionType;
    accountId: string;
    destinationAccountId?: string | null;
  }) {
    if (transaction.type !== TransactionType.TRANSFER) {
      return;
    }

    if (!transaction.destinationAccountId) {
      throw new BadRequestException('Transfer requires a destination account.');
    }

    if (transaction.accountId === transaction.destinationAccountId) {
      throw new BadRequestException('Transfer accounts must be different.');
    }
  }

  private getBalanceDelta(type: TransactionType, amount: Prisma.Decimal) {
    return type === TransactionType.INCOME ? amount : amount.negated();
  }
}

type BalanceTransaction = {
  accountId: string;
  destinationAccountId?: string | null;
  type: TransactionType;
  amount: Prisma.Decimal;
};
