import { Test, TestingModule } from '@nestjs/testing';
import { ProjectTemplatesService } from './project-templates.service';

describe('ProjectTemplatesService', () => {
  let service: ProjectTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectTemplatesService],
    }).compile();

    service = module.get<ProjectTemplatesService>(ProjectTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
