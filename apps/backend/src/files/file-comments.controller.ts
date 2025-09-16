import { Controller, Get, Post, Body, Param, UseGuards, Request, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { FileCommentsService } from './file-comments.service'
import { CreateFileCommentDto } from './dto/create-file-comment.dto'

@ApiTags('File Comments')
@ApiBearerAuth()
@Controller('files/:fileId/comments')
@UseGuards(JwtAuthGuard)
export class FileCommentsController {
  constructor(private readonly fileCommentsService: FileCommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get file comments' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  async getFileComments(@Param('fileId') fileId: string) {
    return this.fileCommentsService.getFileComments(fileId)
  }

  @Post()
  @ApiOperation({ summary: 'Create file comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async createFileComment(
    @Param('fileId') fileId: string,
    @Body() createFileCommentDto: CreateFileCommentDto,
    @Request() req: any
  ) {
    return this.fileCommentsService.createFileComment(
      fileId,
      createFileCommentDto,
      req.user.sub
    )
  }

  @Delete(':commentId')
  @ApiOperation({ summary: 'Delete file comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only delete own comments' })
  async deleteFileComment(
    @Param('fileId') fileId: string,
    @Param('commentId') commentId: string,
    @Request() req: any
  ) {
    return this.fileCommentsService.deleteFileComment(
      fileId,
      commentId,
      req.user.sub
    )
  }
}
