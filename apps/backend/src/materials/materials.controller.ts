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
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Materials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new material' })
  @ApiResponse({ status: 201, description: 'Material created successfully' })
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialsService.create(createMaterialDto);
  }

  @Post('project/:projectId')
  @ApiOperation({ summary: 'Add material to project' })
  @ApiResponse({ status: 201, description: 'Material added to project successfully' })
  addToProject(
    @Param('projectId') projectId: string,
    @Body() body: { materialId: string; quantity: number }
  ) {
    return this.materialsService.addToProject(projectId, body.materialId, body.quantity);
  }

  @Get()
  @ApiOperation({ summary: 'Get all materials' })
  @ApiResponse({ status: 200, description: 'Materials retrieved successfully' })
  findAll() {
    return this.materialsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get materials statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getStats() {
    return this.materialsService.getStats();
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get materials by project' })
  @ApiResponse({ status: 200, description: 'Materials retrieved successfully' })
  findByProject(@Param('projectId') projectId: string) {
    return this.materialsService.findByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material by ID' })
  @ApiResponse({ status: 200, description: 'Material retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  findOne(@Param('id') id: string) {
    return this.materialsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update material' })
  @ApiResponse({ status: 200, description: 'Material updated successfully' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  update(@Param('id') id: string, @Body() updateMaterialDto: Partial<CreateMaterialDto>) {
    return this.materialsService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete material' })
  @ApiResponse({ status: 200, description: 'Material deleted successfully' })
  @ApiResponse({ status: 404, description: 'Material not found' })
  remove(@Param('id') id: string) {
    return this.materialsService.remove(id);
  }
}
