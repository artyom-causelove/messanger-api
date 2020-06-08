import { Controller, UseGuards, SetMetadata, Get, Param } from '@nestjs/common';

import { RoleGuard } from '@messanger/src/role.guard';

import { IMessageBlock } from '@messanger/interfaces';

import { MessageBlocksService } from '@messanger/src/message-blocks/message-blocks.service';
import { ConferencesService } from '@messanger/src/conferences/conferences.service';

@Controller('message-blocks')
export class MessageBlocksController {
  constructor(
    private messageBlocksService: MessageBlocksService,
    private conferencesService: ConferencesService
  ) { }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['authorized'])
  @Get('by-conference/:conf_id/page/:page')
  async getBlockByConference(
    @Param('page') page: number,
    @Param('conf_id') confId: string
  ): Promise<IMessageBlock | { systemMessage: string }> {
    const conf = await this.conferencesService.findById(confId);
    const pageId = conf.messageBlocks[page];

    if (pageId === undefined) {
      return { systemMessage: 'empty' };
    } 

    return await this.messageBlocksService.findById(pageId);
  }
}
