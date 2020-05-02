import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from '@messanger/src/users/users.service';
import { HashService } from '@messanger/src/hash/hash.service';
import { ImageService } from '@messanger/src/image/image.service';
import { RoleGuard } from '@messanger/src/role.guard';
import { SelfGuard } from '@messanger/src/self.guard';

import { UsersController } from '@messanger/src/users/users.controller';

import { UserSchema } from '@messanger/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema }
    ])
  ],
  providers: [UsersService, HashService, ImageService, RoleGuard, SelfGuard],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
