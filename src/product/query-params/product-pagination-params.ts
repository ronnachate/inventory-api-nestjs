import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { BasePaginationParams } from '../../shared/query-parameter/base-pagination-params';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductPaginationParams extends BasePaginationParams {
  @ApiPropertyOptional({
    description: 'status filter, Optional, ',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  status = 1;

  @ApiPropertyOptional({
    description: 'category filter, Optional',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  category = undefined;
}
