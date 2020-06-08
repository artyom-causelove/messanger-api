import { Module } from '@nestjs/common';

import { MessagesService } from '@messanger/src/messages/messages.service';
import { ConferencesService } from '@messanger/src/conferences/conferences.service';
import { UsersService } from '@messanger/src/users/users.service';
import { MessageBlocksService } from '@messanger/src/message-blocks/message-blocks.service';

import { RoleGuard } from '@messanger/src/role.guard';

import { MessagesController } from '@messanger/src/messages/messages.controller';

import { MongooseModule } from '@nestjs/mongoose';

import { 
  MessageBlockSchema,
  UserSchema,
  MessageSchema,
  ConferenceSchema,
  ConferenceParticipantSchema
} from '@messanger/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MessageBlock', schema: MessageBlockSchema, collection: 'messageBlocks' },
      { name: 'ConferenceParticipant', schema: ConferenceParticipantSchema, collection: 'conferenceParticipants' },
      { name: 'Conference', schema: ConferenceSchema },
      { name: 'Message', schema: MessageSchema },
      { name: 'User', schema: UserSchema }
    ]),
  ],
  providers: [MessagesService, MessageBlocksService, RoleGuard, ConferencesService, UsersService],
  controllers: [MessagesController]
})
export class MessagesModule {}
