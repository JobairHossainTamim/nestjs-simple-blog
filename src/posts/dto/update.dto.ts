import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdatePostDTO {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title is too short' })
  @MaxLength(500, { message: 'Title is too long' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  @MinLength(10, { message: 'Content is too short' })
  @MaxLength(5000, { message: 'Content is too long' })
  content?: string;

  @IsOptional()
  author?: string;
}
