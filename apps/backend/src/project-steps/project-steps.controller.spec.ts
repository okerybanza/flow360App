import { Test, TestingModule } from '@nestjs/testing';
import { ProjectStepsController } from './project-steps.controller';

describe('ProjectStepsController', () => {
  let controller: ProjectStepsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectStepsController],
    }).compile();

    controller = module.get<ProjectStepsController>(ProjectStepsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
