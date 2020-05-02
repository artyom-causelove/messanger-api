import { Module } from '@nestjs/common';

import { UsersService} from '@messanger/src/users/users.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@messanger/src/users/users.module';

import { UsersController } from '@messanger/src/users/users.controller';

import { UserSchema, ConferenceSchema } from '@messanger/schemas';
import { HashService } from './hash/hash.service';
import { ImageService } from './image/image.service';
import { ConferencesController } from './conferences/conferences.controller';
import { ConferencesService } from './conferences/conferences.service';
import { ConferencesModule } from './conferences/conferences.module';

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
      { name: 'User', schema: UserSchema }
    ]),
    MongooseModule.forFeature([
      { name: 'Conference', schema: ConferenceSchema }
    ]),
    UsersModule,
    ConferencesModule
  ],
  controllers: [UsersController, ConferencesController],
  providers: [UsersService, HashService, ImageService, ConferencesService],
})
export class AppModule {}
