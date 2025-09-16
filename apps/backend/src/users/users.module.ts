import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UploadService } from '../common/services/upload.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UploadService],
  exports: [UsersService],
})
export class UsersModule {}
