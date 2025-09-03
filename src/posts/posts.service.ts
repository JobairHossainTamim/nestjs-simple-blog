import { CreatePostDTO } from './dto/create.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePostDTO } from './dto/update.dto';
import { UserRole, Users } from 'src/auth/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  /**
   * Returns all posts.
   */
  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author'],
    });
  }

  /**
   * Returns a single post by ID.
   * Throws NotFoundException if not found.
   */
  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  /**
   * Creates a new post with auto-generated ID and timestamps.
   */
  async create(createPostData: CreatePostDTO, author: Users): Promise<Post> {
    const post = this.postRepository.create({
      title: createPostData.title,
      content: createPostData.content,
      author: author,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.postRepository.save(post);
  }

  /**
   * Updates an existing post by ID.
   * Throws NotFoundException if not found.
   */
  /**
   * Updates an existing post by ID.
   * Only the author or an admin can update.
   */
  async update(
    id: number,
    updateData: UpdatePostDTO,
    author: Users,
  ): Promise<Post> {
    const post = await this.findOne(id);

    if (post.author.id !== author.id && author.role !== UserRole.ADMIN) {
      throw new ForbiddenException(`You are not allowed to update this post`);
    }

    Object.assign(post, updateData, { updatedAt: new Date() });
    return await this.postRepository.save(post);
  }

  /**
   * Deletes a post by ID.
   * Only the author or an admin can delete.
   */
  async delete(id: number, author: Users): Promise<void> {
    const post = await this.findOne(id);

    if (post.author.id !== author.id && author.role !== UserRole.ADMIN) {
      throw new ForbiddenException(`You are not allowed to delete this post`);
    }

    await this.postRepository.delete(id);
  }
}
