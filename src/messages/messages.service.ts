import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IMessage } from '@messanger/interfaces';
import { CreateMessageDto } from '@messanger/dtos';

import { Service } from '@messanger/service';

@Injectable()
export class MessagesService extends Service<IMessage> {
  constructor(
    @InjectModel('Message') protected model: Model<IMessage>
  ) {
    super();
  }

  async create(createMessageDto: CreateMessageDto): Promise<IMessage> {
    const createdMessage = new this.model(createMessageDto);
    
    return createdMessage.save();
  }
}
