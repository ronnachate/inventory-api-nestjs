import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { BasePaginationParams } from '../../shared/query-parameter/base-pagination-params';

export class UserPaginationParams extends BasePaginationParams {
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    status = 1;
}
