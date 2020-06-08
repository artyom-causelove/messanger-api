import { Test, TestingModule } from '@nestjs/testing';
import { MessageBlocksService } from '@messanger/src/message-blocks/message-blocks.service';

describe('MessageBlocksService', () => {
  let service: MessageBlocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageBlocksService],
    }).compile();

    service = module.get<MessageBlocksService>(MessageBlocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
