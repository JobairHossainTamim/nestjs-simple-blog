import { CreatePostDTO } from './dto/create.dto';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePostDTO } from './dto/update.dto';
import { UserRole, Users } from 'src/auth/entities/user.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { FindPostQueryDto } from './dto/find.post.query.dto';
import { PaginationResponse } from 'src/common/interface/pagination.response.interface';

@Injectable()
export class PostsService {
  private postListCacheKeys = new Set<string>();
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // generate catch key
  private generatePostListKey(query: FindPostQueryDto): string {
    const { page = 1, limit = 10, title } = query;
    return `posts_list_page${page}_limit${limit}_title${title || 'all'}`;
  }

  /**
   * Returns all posts.
   */
  async findAll(query: FindPostQueryDto): Promise<PaginationResponse<Post>> {
    const cacheKey = this.generatePostListKey(query);

    this.postListCacheKeys.add(cacheKey);

    const getCachedData =
      await this.cacheManager.get<PaginationResponse<Post>>(cacheKey);

    if (getCachedData) {
      return getCachedData;
    }

    const { page = 1, limit = 10, title } = query;
    const skip = (page - 1) * limit;

    const queryBuilders = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (title) {
      queryBuilders.andWhere('post.title ILIKE :title', {
        title: `%${title}%`,
      });
    }

    const [data, totalItems] = await queryBuilders.getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    const responseResult = {
      data,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasNextPage: page > 1,
        hasPreviousPage: page < totalPages,
      },
    };

    await this.cacheManager.set(cacheKey, responseResult, 30000);

    return responseResult;
  }

  /**
   * Returns a single post by ID.
   * Throws NotFoundException if not found.
   */
  async findOne(id: number): Promise<Post> {
    const cacheKey = `post_${id}`;

    const cachedPost = await this.cacheManager.get<Post>(cacheKey);

    if (cachedPost) {
      return cachedPost;
    }

    const SinglePost = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!SinglePost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // pass
    await this.cacheManager.set(cacheKey, SinglePost, 30000);

    return SinglePost;
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

    // invalid the existing  cache
    await this.invalidAllExistingListCaches();

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

    await this.cacheManager.del(`post_${id}`);
    await this.invalidAllExistingListCaches();

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
    await this.cacheManager.del(`post_${id}`);
    await this.invalidAllExistingListCaches();
  }

  private async invalidAllExistingListCaches(): Promise<void> {
    for (const key of this.postListCacheKeys) {
      await this.cacheManager.del(key);
    }
    this.postListCacheKeys.clear();
  }
}
