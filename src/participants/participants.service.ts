import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IConferenceParticipant, IConference } from '@messanger/interfaces';
import { Service } from '@messanger/service';

@Injectable()
export class ConferenceParticipantsService extends Service<IConferenceParticipant> {
  constructor(
    @InjectModel('Conference') protected model: Model<IConference>,
    @InjectModel('ConferenceParticipant') protected conferenceParticipantModel: Model<IConferenceParticipant>
  ) {
    super();
  }
}
