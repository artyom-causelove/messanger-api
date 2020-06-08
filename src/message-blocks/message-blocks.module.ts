import { Module } from '@nestjs/common';

import { MessageBlocksController } from '@messanger/src/message-blocks/message-blocks.controller';

import { MongooseModule } from '@nestjs/mongoose';

import {
  MessageBlockSchema,
  UserSchema,
  ConferenceSchema,
  ConferenceParticipantSchema
} from '@messanger/schemas';

import { RoleGuard } from '@messanger/src/role.guard';

import { UsersService } from '@messanger/src/users/users.service';
import { MessageBlocksService } from '@messanger/src/message-blocks/message-blocks.service';
import { ConferencesService } from '@messanger/src/conferences/conferences.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MessageBlock', schema: MessageBlockSchema, collection: 'messageBlocks' },
      { name: 'User', schema: UserSchema },
      { name: 'Conference', schema: ConferenceSchema },
      { name: 'ConferenceParticipant', schema: ConferenceParticipantSchema, collection: 'conferenceParticipants' },
    ]),
  ],
  providers: [MessageBlocksService, ConferencesService, RoleGuard, UsersService],
  controllers: [MessageBlocksController]
})
export class MessageBlocksModule {}
