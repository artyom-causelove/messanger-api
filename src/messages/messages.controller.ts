import { Controller, UseGuards, SetMetadata, Get, Param } from '@nestjs/common';

import { MessagesService } from '@messanger/src/messages/messages.service';
import { MessageBlocksService } from '@messanger/src/message-blocks/message-blocks.service';

import { RoleGuard } from '@messanger/src/role.guard';

import { IMessage } from '@messanger/interfaces';

@Controller('messages')
export class MessagesController {
  constructor(
    private messageBlocksService: MessageBlocksService,
    private messagesService: MessagesService
  ) { }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['authorized'])
  @Get('by-message-block/:id')
  async getMessagesByBlock(@Param('id') blockId: string): Promise<IMessage[]> {
    const block = await this.messageBlocksService.findById(blockId);

    return this.messagesService.findBy({ _id: { $in: block.messages } });
  }
}
