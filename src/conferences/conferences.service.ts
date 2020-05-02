import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IConference } from '@messanger/interfaces';
import { CreateConferenceDto } from '@messanger/dtos';

@Injectable()
export class ConferencesService {
  constructor(
    @InjectModel('Conference') private conferenceModel: Model<IConference>
  ) { }

  async all(): Promise<IConference[]> {
    return this.conferenceModel.find().exec();
  }

  async findByIds(ids: string[]): Promise<IConference[]> {
    return this.conferenceModel.find({ _id: { $in: ids } }).exec();
  }

  async findById(id: string): Promise<IConference> {
    return this.conferenceModel.findById(id).exec();
  }

  async updateModel(conference: Model<IConference>, values: any): Promise<IConference> {
    for (const field in values) {
      conference[field] = values[field];
    }

    return conference.save();
  }

  async create(createConferenceDto: CreateConferenceDto): Promise<IConference> {
    createConferenceDto['date'] = new Date();

    if (!createConferenceDto['avatar']) {
      createConferenceDto['avatar'] = null;
    }

    const createdConference = new this.conferenceModel(createConferenceDto);
    
    return createdConference.save();
  }
}
