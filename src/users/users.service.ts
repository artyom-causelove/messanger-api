import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUser } from '@messanger/interfaces';
import { CreateUserDto } from '@messanger/dtos';
import { LoginUserDto } from '@messanger/dtos';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel('User') private userModel: Model<IUser>
  ) { }

  async all(): Promise<IUser[]> {
    return this.userModel.find().exec();
  }

  async findById(id: any): Promise<IUser> {
    return this.userModel.findById(id).exec();
  }

  async findOneBy(conditions: any): Promise<IUser> {
    return this.userModel.findOne(conditions).exec();
  }
  
  async findBy(conditions: any): Promise<IUser[]> {
    return this.userModel.find(conditions).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    createUserDto['age'] = null;
    createUserDto['status'] = 'offline';
    createUserDto['lastVisit'] = new Date();
    createUserDto['apiKey'] = null;
    createUserDto['roles'] = [];
    createUserDto['avatar'] = null;
    createUserDto['conferences'] = [];

    const createdUser = new this.userModel(createUserDto);
    
    return createdUser.save();
  }

  async findByLoginAndPassword(loginUserDto: LoginUserDto): Promise<IUser> {
    return this.userModel.findOne(loginUserDto).exec();
  }

  async updateApiKey(user: Model<IUser>, apiKey: string): Promise<IUser> {
    return user.set('apiKey', apiKey).save();
  }

  async updateModel(user: Model<IUser>, values: any): Promise<IUser> {
    for (const field in values) {
      user[field] = values[field];
    }

    return user.save();
  }
}
