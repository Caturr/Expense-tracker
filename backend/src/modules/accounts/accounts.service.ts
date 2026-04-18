import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(userId: string, id: string) {
    return this.prisma.account.findFirstOrThrow({
      where: { id, userId },
    });
  }

  create(userId: string, createAccountDto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        ...createAccountDto,
        userId,
      },
    });
  }

  async update(userId: string, id: string, updateAccountDto: UpdateAccountDto) {
    await this.findOne(userId, id);

    return this.prisma.account.update({
      where: { id },
      data: updateAccountDto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.account.delete({
      where: { id },
    });
  }
}
