import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('step/:stepId')
  @ApiOperation({ summary: 'Get all tasks for a specific step' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  findByStep(@Param('stepId') stepId: string) {
    return this.tasksService.findByStep(stepId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  // Task Materials endpoints
  @Post(':id/materials')
  addMaterials(@Param('id') taskId: string, @Body() body: { materials: { materialId: string; quantity: number }[] }) {
    return this.tasksService.addMaterials(taskId, body.materials);
  }

  @Get(':id/materials')
  getMaterials(@Param('id') taskId: string) {
    return this.tasksService.getMaterials(taskId);
  }

  @Delete(':taskId/materials/:materialId')
  removeMaterial(@Param('taskId') taskId: string, @Param('materialId') materialId: string) {
    return this.tasksService.removeMaterial(taskId, materialId);
  }
}
