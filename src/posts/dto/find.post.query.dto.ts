import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination.tdo';

export class FindPostQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: 'The title must be a string' })
  @Type(() => String)
  title?: string;
}
