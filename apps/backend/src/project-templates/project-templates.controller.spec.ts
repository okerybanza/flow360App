import { Test, TestingModule } from '@nestjs/testing';
import { ProjectTemplatesController } from './project-templates.controller';

describe('ProjectTemplatesController', () => {
  let controller: ProjectTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectTemplatesController],
    }).compile();

    controller = module.get<ProjectTemplatesController>(ProjectTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
