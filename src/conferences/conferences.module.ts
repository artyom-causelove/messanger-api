import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConferencesService } from '@messanger/src/conferences/conferences.service';
import { HashService } from '@messanger/src/hash/hash.service';
import { ImageService } from '@messanger/src/image/image.service';
import { RoleGuard } from '@messanger/src/role.guard';
import { SelfGuard } from '@messanger/src/self.guard';

import { ConferencesController } from '@messanger/src/conferences/conferences.controller';

import { UsersModule } from '@messanger/src/users/users.module'

import { ConferenceSchema } from '@messanger/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Conference', schema: ConferenceSchema }
    ]),
    UsersModule
  ],
  providers: [ConferencesService, HashService, ImageService, RoleGuard, SelfGuard],
  exports: [ConferencesService],
  controllers: [ConferencesController]
})
export class ConferencesModule {}
