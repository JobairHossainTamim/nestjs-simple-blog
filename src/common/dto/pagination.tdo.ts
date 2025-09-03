import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'The limit must be an integer' })
  @Min(1, { message: 'The limit must be at least 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'The limit must be an integer' })
  @Min(1, { message: 'The limit must be at least 1' })
  @Max(100, { message: 'The limit must not be greater than 100' })
  limit?: number = 10;
}
