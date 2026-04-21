import { AccountPurpose, AccountType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @IsOptional()
  @IsEnum(AccountPurpose)
  purpose?: AccountPurpose;

  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;
}
