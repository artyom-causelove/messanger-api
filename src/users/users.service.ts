import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { IUser } from '@messanger/interfaces';
import { CreateUserDto } from '@messanger/dtos';
import { LoginUserDto } from '@messanger/dtos';

import { Service } from '@messanger/service';

@Injectable()
export class UsersService extends Service<IUser> {

  constructor(
    @InjectModel('User') protected model: Model<IUser>
  ) {
    super();
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    createUserDto['age'] = null;
    createUserDto['status'] = 'offline';
    createUserDto['lastVisit'] = new Date();
    createUserDto['apiKey'] = null;
    createUserDto['roles'] = [];
    createUserDto['avatar'] = null;
    createUserDto['conferences'] = [];
    createUserDto['outerId'] = Types.ObjectId();

    const createdUser = new this.model(createUserDto);
    
    return createdUser.save();
  }

  async findByLoginAndPassword(loginUserDto: LoginUserDto): Promise<IUser> {
    return this.model.findOne(loginUserDto).exec();
  }

  async updateApiKey(user: Model<IUser>, apiKey: string): Promise<IUser> {
    return user.set('apiKey', apiKey).save();
  }
}
