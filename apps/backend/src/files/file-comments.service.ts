import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { CreateFileCommentDto } from './dto/create-file-comment.dto'

@Injectable()
export class FileCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFileComments(fileId: string) {
    const comments = await this.prisma.fileComment.findMany({
      where: {
        fileId,
        parentId: null // Only get top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return comments
  }

  async createFileComment(fileId: string, createFileCommentDto: CreateFileCommentDto, userId: string) {
    // Verify file exists
    const file = await this.prisma.file.findUnique({
      where: { id: fileId }
    })

    if (!file) {
      throw new NotFoundException('File not found')
    }

    // If it's a reply, verify parent comment exists
    if (createFileCommentDto.parentId) {
      const parentComment = await this.prisma.fileComment.findUnique({
        where: { id: createFileCommentDto.parentId }
      })

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found')
      }
    }

    const comment = await this.prisma.fileComment.create({
      data: {
        content: createFileCommentDto.content,
        fileId,
        userId,
        parentId: createFileCommentDto.parentId || null
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true
          }
        }
      }
    })

    return comment
  }

  async deleteFileComment(fileId: string, commentId: string, userId: string) {
    // Verify file exists
    const file = await this.prisma.file.findUnique({
      where: { id: fileId }
    })

    if (!file) {
      throw new NotFoundException('File not found')
    }

    // Verify comment exists and belongs to user
    const comment = await this.prisma.fileComment.findUnique({
      where: { id: commentId }
    })

    if (!comment) {
      throw new NotFoundException('Comment not found')
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments')
    }

    // Delete the comment (replies will be deleted automatically due to cascade)
    await this.prisma.fileComment.delete({
      where: { id: commentId }
    })

    return { message: 'Comment deleted successfully' }
  }
}
