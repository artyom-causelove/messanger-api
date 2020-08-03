import { Module } from '@nestjs/common';

import { UsersService} from '@messanger/src/users/users.service';
import { MessagesService } from '@messanger/src/messages/messages.service';
import { HashService } from '@messanger/src/hash/hash.service';
import { ConferencesService } from '@messanger/src/conferences/conferences.service';
import { ImageService } from '@messanger/src/image/image.service';
import { MessageBlocksService } from '@messanger/src/message-blocks/message-blocks.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@messanger/src/users/users.module';
import { MessagesModule } from '@messanger/src/messages/messages.module';
import { ConferencesModule } from '@messanger/src/conferences/conferences.module';
import { MessageBlocksModule } from '@messanger/src/message-blocks/message-blocks.module';

import { UsersController } from '@messanger/src/users/users.controller';
import { ConferencesController } from '@messanger/src/conferences/conferences.controller';
import { MessageBlocksController } from '@messanger/src/message-blocks/message-blocks.controller';

import { AppGateway } from '@messanger/src/app.gateway';

import { 
  UserSchema,
  ConferenceSchema,
  ConferenceParticipantSchema,
  MessageBlockSchema,
  MessageSchema
} from '@messanger/schemas';
import { ConferenceParticipantsService } from './participants/participants.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://tyhbvfghjkiuhnm:SJVpFUZMU0HxVeF7@messangerapi-ambqd.mongodb.net/messanger?retryWrites=true&w=majority`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
      },
    ),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'MessageBlock', schema: MessageBlockSchema, collection: 'messageBlocks' },
      { name: 'Conference', schema: ConferenceSchema },
      { name: 'ConferenceParticipant', schema: ConferenceParticipantSchema, collection: 'conferenceParticipants' },
      { name: 'Message', schema: MessageSchema }
    ]),
    UsersModule,
    ConferencesModule,
    MessageBlocksModule,
    MessagesModule,
  ],
  controllers: [
    UsersController,
    ConferencesController,
    MessageBlocksController
  ],
  providers: [
    UsersService,
    MessageBlocksService,
    MessagesService,
    HashService,
    ImageService,
    ConferencesService,
    ConferenceParticipantsService,
    AppGateway
  ],
})
export class AppModule {}
