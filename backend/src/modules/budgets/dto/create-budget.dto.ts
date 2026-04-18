import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @Type(() => Date)
  @IsDate()
  startsAt!: Date;

  @Type(() => Date)
  @IsDate()
  endsAt!: Date;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
