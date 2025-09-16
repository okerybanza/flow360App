import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from '../common/services/upload.service';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly uploadService: UploadService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new file' })
  @ApiResponse({ status: 201, description: 'File created successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { projectId: string },
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Utiliser le service d'upload moderne
    const uploadResult = await this.uploadService.uploadFile(
      file,
      this.uploadService.getGenericFileConfig()
    );

    const fileData = {
      name: file.originalname,
      url: `/uploads/files/${uploadResult.filename}`,
      type: file.mimetype,
      size: file.size,
      projectId: body.projectId,
    };

    return this.filesService.create(fileData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all files' })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
  findAll() {
    return this.filesService.findAll();
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get files by project' })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
  findByProject(@Param('projectId') projectId: string) {
    return this.filesService.findByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiResponse({ status: 200, description: 'File retrieved successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}
