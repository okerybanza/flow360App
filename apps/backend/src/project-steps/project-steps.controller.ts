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
import { ProjectStepsService } from './project-steps.service';
import { CreateProjectStepDto } from './dto/create-project-step.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Project Steps')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('project-steps')
export class ProjectStepsController {
  constructor(private readonly projectStepsService: ProjectStepsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project step' })
  @ApiResponse({ status: 201, description: 'Project step created successfully' })
  create(@Body() createProjectStepDto: CreateProjectStepDto) {
    return this.projectStepsService.create(createProjectStepDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all project steps' })
  @ApiResponse({ status: 200, description: 'Project steps retrieved successfully' })
  findAll() {
    return this.projectStepsService.findAll();
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all steps for a specific project' })
  @ApiResponse({ status: 200, description: 'Project steps retrieved successfully' })
  findByProject(@Param('projectId') projectId: string) {
    return this.projectStepsService.findByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project step by ID' })
  @ApiResponse({ status: 200, description: 'Project step retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.projectStepsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project step' })
  @ApiResponse({ status: 200, description: 'Project step updated successfully' })
  update(@Param('id') id: string, @Body() updateProjectStepDto: Partial<CreateProjectStepDto>) {
    return this.projectStepsService.update(id, updateProjectStepDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project step' })
  @ApiResponse({ status: 200, description: 'Project step deleted successfully' })
  remove(@Param('id') id: string) {
    return this.projectStepsService.remove(id);
  }
}
