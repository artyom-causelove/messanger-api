import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IConference, IConferenceParticipant } from '@messanger/interfaces';
import { CreateConferenceDto, CreateConferenceParticipantDto } from '@messanger/dtos';
import { Service } from '@messanger/service';

@Injectable()
export class ConferencesService extends Service<IConference> {
  constructor(
    @InjectModel('Conference') protected model: Model<IConference>,
    @InjectModel('ConferenceParticipant') protected conferenceParticipantModel: Model<IConference>
  ) {
    super();
  }

  async create(createConferenceDto: CreateConferenceDto): Promise<IConference> {
    createConferenceDto['date'] = new Date();
    createConferenceDto['messageBlocks'] = [];
    createConferenceDto['participants'] = [createConferenceDto.ownerUserId];

    if (!createConferenceDto['avatar']) {
      createConferenceDto['avatar'] = null;
    }

    const createdConference = new this.model(createConferenceDto);

    const createConferenceParticipantDto = new CreateConferenceParticipantDto();
    createConferenceParticipantDto.userId = createdConference['ownerUserId'];
    createConferenceParticipantDto.conferenceId = createdConference['_id'];
    await this.createConferenceParticipant(createConferenceParticipantDto);
    
    return createdConference.save();
  }

  async createConferenceParticipant(
    createConferenceParticipantDto: CreateConferenceParticipantDto
  ): Promise<IConferenceParticipant> {
    const createdConferenceParticipant = new this.conferenceParticipantModel(createConferenceParticipantDto);

    return createdConferenceParticipant.save();
  }
}
