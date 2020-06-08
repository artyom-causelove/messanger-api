import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateMessageBlockDto } from '@messanger/dtos';
import { IMessageBlock } from '@messanger/interfaces';

import { Service } from '@messanger/service';

@Injectable()
export class MessageBlocksService extends Service<IMessageBlock> {
  constructor(
    @InjectModel('MessageBlock') protected model: Model<IMessageBlock>
  ) {
    super();
  }

  async create(createMessageBlockDto: CreateMessageBlockDto): Promise<IMessageBlock> {
    const createdMessageBlock = new this.model(createMessageBlockDto);
    
    return createdMessageBlock.save();
  }
}
