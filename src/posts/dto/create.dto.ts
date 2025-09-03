import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDTO {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(5, { message: 'Title is too short' })
  @MaxLength(500, { message: 'Title is too long' })
  title: string;

  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(10, { message: 'Content is too short' })
  @MaxLength(5000, { message: 'Content is too long' })
  content: string;
}
