import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class UpdateBudgetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startsAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endsAt?: Date;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
