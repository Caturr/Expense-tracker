import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/types/auth-user';
import { ReportQueryDto } from './dto/report-query.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('expense-by-category')
  getExpenseByCategory(@CurrentUser() user: AuthUser, @Query() query: ReportQueryDto) {
    return this.reportsService.getExpenseByCategory(user.id, query);
  }

  @Get('expense-by-account')
  getExpenseByAccount(@CurrentUser() user: AuthUser, @Query() query: ReportQueryDto) {
    return this.reportsService.getExpenseByAccount(user.id, query);
  }

  @Get('income-expense-trend')
  getIncomeExpenseTrend(@CurrentUser() user: AuthUser, @Query() query: ReportQueryDto) {
    return this.reportsService.getIncomeExpenseTrend(user.id, query);
  }
}
