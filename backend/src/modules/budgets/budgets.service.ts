import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.budget.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: { startsAt: 'desc' },
    });
  }

  findOne(userId: string, id: string) {
    return this.prisma.budget.findFirstOrThrow({
      where: { id, userId },
      include: {
        category: true,
      },
    });
  }

  create(userId: string, createBudgetDto: CreateBudgetDto) {
    return this.prisma.budget.create({
      data: {
        ...createBudgetDto,
        userId,
      },
    });
  }

  async update(userId: string, id: string, updateBudgetDto: UpdateBudgetDto) {
    await this.findOne(userId, id);

    return this.prisma.budget.update({
      where: { id },
      data: updateBudgetDto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.budget.delete({
      where: { id },
    });
  }
}
