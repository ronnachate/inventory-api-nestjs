import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BasePaginationParams {
  @ApiPropertyOptional({
    description: 'Optional, defaults to 1',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  page = 1;

  @ApiPropertyOptional({
    description: 'Optional, defaults to 10',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  rows = 10;
}
