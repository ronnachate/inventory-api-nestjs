import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { BasePaginationParams } from '../../shared/query-parameter/base-pagination-params';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserPaginationParams extends BasePaginationParams {
  @ApiPropertyOptional({
    description: 'Optional, defaults to 10',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  status = 1;
}
