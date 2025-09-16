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
import { ProjectTemplatesService } from './project-templates.service';
import { CreateProjectTemplateDto } from './dto/create-project-template.dto';
import { CreateTemplateStepDto } from './dto/create-template-step.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Project Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('project-templates')
export class ProjectTemplatesController {
  constructor(private readonly projectTemplatesService: ProjectTemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project template' })
  @ApiResponse({ status: 201, description: 'Project template created successfully' })
  create(@Body() createProjectTemplateDto: CreateProjectTemplateDto) {
    return this.projectTemplatesService.create(createProjectTemplateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all project templates' })
  @ApiResponse({ status: 200, description: 'Project templates retrieved successfully' })
  findAll() {
    return this.projectTemplatesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project template by ID' })
  @ApiResponse({ status: 200, description: 'Project template retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project template not found' })
  findOne(@Param('id') id: string) {
    return this.projectTemplatesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project template' })
  @ApiResponse({ status: 200, description: 'Project template updated successfully' })
  @ApiResponse({ status: 404, description: 'Project template not found' })
  update(@Param('id') id: string, @Body() updateProjectTemplateDto: Partial<CreateProjectTemplateDto>) {
    return this.projectTemplatesService.update(id, updateProjectTemplateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project template' })
  @ApiResponse({ status: 200, description: 'Project template deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project template not found' })
  remove(@Param('id') id: string) {
    return this.projectTemplatesService.remove(id);
  }

  @Post(':id/steps')
  @ApiOperation({ summary: 'Add step to project template' })
  @ApiResponse({ status: 201, description: 'Step added successfully' })
  addStep(@Param('id') id: string, @Body() createStepDto: CreateTemplateStepDto) {
    return this.projectTemplatesService.addStep(id, createStepDto);
  }

  @Patch(':templateId/steps/:stepId')
  @ApiOperation({ summary: 'Update step in project template' })
  @ApiResponse({ status: 200, description: 'Step updated successfully' })
  updateStep(
    @Param('templateId') templateId: string,
    @Param('stepId') stepId: string,
    @Body() updateStepDto: Partial<CreateTemplateStepDto>
  ) {
    return this.projectTemplatesService.updateStep(templateId, stepId, updateStepDto);
  }

  @Delete(':templateId/steps/:stepId')
  @ApiOperation({ summary: 'Delete step from project template' })
  @ApiResponse({ status: 200, description: 'Step deleted successfully' })
  removeStep(@Param('templateId') templateId: string, @Param('stepId') stepId: string) {
    return this.projectTemplatesService.removeStep(templateId, stepId);
  }

  @Post(':id/apply/:projectId')
  @ApiOperation({ summary: 'Apply template to project' })
  @ApiResponse({ status: 201, description: 'Template applied successfully' })
  applyToProject(@Param('id') id: string, @Param('projectId') projectId: string) {
    return this.projectTemplatesService.createFromTemplate(id, projectId);
  }
}
