import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { MessageAttachmentsService } from './message-attachments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messageAttachmentsService: MessageAttachmentsService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message created successfully' })
  create(
    @Body() createMessageDto: { content: string; projectId: string },
    @Req() req: any,
  ) {
    return this.messagesService.create({
      ...createMessageDto,
      userId: req.user.sub,
    });
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get messages by project' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  findByProject(@Param('projectId') projectId: string) {
    return this.messagesService.findByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by ID' })
  @ApiResponse({ status: 200, description: 'Message retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update message' })
  @ApiResponse({ status: 200, description: 'Message updated successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  update(@Param('id') id: string, @Body() updateMessageDto: { content: string }) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete message' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }

  // File Attachment Endpoints
  @Post(':messageId/attachments')
  @ApiOperation({ summary: 'Attach file to message' })
  @ApiResponse({ status: 201, description: 'File attached successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async attachFile(
    @Param('messageId') messageId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.messageAttachmentsService.attachFileToMessage(
      messageId,
      file,
      req.user.sub
    );
  }

  @Get(':messageId/attachments')
  @ApiOperation({ summary: 'Get message attachments' })
  @ApiResponse({ status: 200, description: 'Attachments retrieved successfully' })
  async getAttachments(@Param('messageId') messageId: string) {
    return this.messageAttachmentsService.getMessageAttachments(messageId);
  }

  @Delete(':messageId/attachments/:fileId')
  @ApiOperation({ summary: 'Remove file attachment from message' })
  @ApiResponse({ status: 200, description: 'Attachment removed successfully' })
  @ApiResponse({ status: 404, description: 'Message or attachment not found' })
  async removeAttachment(
    @Param('messageId') messageId: string,
    @Param('fileId') fileId: string,
    @Req() req: any
  ) {
    return this.messageAttachmentsService.removeAttachment(
      messageId,
      fileId,
      req.user.sub
    );
  }

  @Get('project/:projectId/files-from-messages')
  @ApiOperation({ summary: 'Get all files from project messages' })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
  async getProjectFilesFromMessages(@Param('projectId') projectId: string) {
    return this.messageAttachmentsService.getProjectFilesFromMessages(projectId);
  }
}
