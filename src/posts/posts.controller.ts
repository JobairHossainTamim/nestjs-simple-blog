import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';

import { CreatePostDTO } from './dto/create.dto';
import { UpdatePostDTO } from './dto/update.dto';
import { PostExistPipe } from './pipes/post.exist.pipe';
import { Post as PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { Users } from 'src/auth/entities/user.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * GET /posts
   * Returns all posts, optionally filtered by title (case-insensitive search).
   */
  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  /**
   * GET /posts/:id
   * Returns a single post by its ID.
   */
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe, PostExistPipe) id: number,
  ): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  /**
   * POST /posts
   * Creates a new post (id, createdAt, updatedAt are generated automatically).
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  create(
    @Body() post: CreatePostDTO,
    @CurrentUser() user: any,
  ): Promise<PostEntity> {
    // adjust according to your authentication setup
    return this.postsService.create(post, user);
  }

  /**
   * PUT /posts/:id
   * Updates an existing post by ID.
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe, PostExistPipe) id: number,
    @Body() updateData: UpdatePostDTO,
    @CurrentUser() user: Users,
  ): { message: string; data: Promise<PostEntity> } {
    const updatedPost = this.postsService.update(id, updateData, user);
    return {
      message: 'Post updated successfully ✅',
      data: updatedPost,
    };
  }

  /**
   * DELETE /posts/:id
   * Deletes a post by ID.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe, PostExistPipe) id: number,
    @CurrentUser() user: Users,
  ): Promise<{ message: string }> {
    await this.postsService.delete(id, user);
    return { message: 'Post deleted successfully ✅' };
  }
}
