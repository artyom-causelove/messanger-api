import { Test, TestingModule } from '@nestjs/testing';
import { MessageBlocksController } from '@messanger/src/message-blocks/message-blocks.controller';

describe('MessageBlocks Controller', () => {
  let controller: MessageBlocksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageBlocksController],
    }).compile();

    controller = module.get<MessageBlocksController>(MessageBlocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
