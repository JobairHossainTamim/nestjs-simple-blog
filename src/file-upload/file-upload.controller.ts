import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { FileUploadService } from './file-upload.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadFileDto } from './dto/upload.file.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { UserRole, Users } from 'src/auth/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorator/role.decorator';
import { RolesGuard } from 'src/auth/guard/roles-guard';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly FileUploadService: FileUploadService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFile: UploadFileDto,
    @CurrentUser() user: Users,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.FileUploadService.uploadFile(
      file,
      uploadFile.description,
      user,
    );
  }

  @Get()
  async findAll() {
    return this.FileUploadService.findAll();
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.FileUploadService.remove(id);
    return { message: 'File deleted successfully' };
  }
}
