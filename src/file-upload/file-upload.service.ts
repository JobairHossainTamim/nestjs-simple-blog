import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { Users } from 'src/auth/entities/user.entity';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    description: string | undefined,
    user: Users,
  ): Promise<File> {
    const cloudinaryResponse = await this.cloudinaryService.uploadFile(file);

    const newlyCreatedFile = this.fileRepository.create({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: cloudinaryResponse?.secure_url,
      publicId: cloudinaryResponse?.public_id,
      description,
      uploader: user,
    });

    return this.fileRepository.save(newlyCreatedFile);
  }

  async findAll(): Promise<File[]> {
    return this.fileRepository.find({
      relations: ['uploader'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    const fileTobeDeleted = await this.fileRepository.findOne({
      where: { id },
    });

    if (!fileTobeDeleted) {
      throw new NotFoundException('File not found');
    }

    // delete from cloudinary
    await this.cloudinaryService.deleteFile(fileTobeDeleted?.publicId);
  }
}
