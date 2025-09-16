import { Test, TestingModule } from '@nestjs/testing';
import { ProjectStepsService } from './project-steps.service';

describe('ProjectStepsService', () => {
  let service: ProjectStepsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectStepsService],
    }).compile();

    service = module.get<ProjectStepsService>(ProjectStepsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
