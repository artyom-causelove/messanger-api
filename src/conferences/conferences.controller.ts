import {
  Controller,
  Post,
  Body,
  UseGuards,
  SetMetadata,
  Put,
  Headers,
  Param,
  HttpStatus,
  BadRequestException,
  Get
} from '@nestjs/common';
import { Types } from 'mongoose';

import { UsersService } from '@messanger/src/users/users.service';
import { HashService } from '@messanger/src/hash/hash.service';
import { ImageService } from '@messanger/src/image/image.service';
import { ConferencesService } from '@messanger/src/conferences/conferences.service';

import { IConference, IUser } from '@messanger/interfaces';
import { CreateConferenceDto, EditConferenceDto } from '@messanger/dtos';

import { RoleGuard } from '@messanger/src/role.guard';
import { ConferenceParticipantsService } from '../participants/participants.service';

@Controller('conferences')
export class ConferencesController {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private imageService: ImageService,
    private conferencesService: ConferencesService,
    private conferenceParticipantsService: ConferenceParticipantsService
  ) { }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['authorized'])
  @Put(':conference_id')
  async editConference(
    @Body() editConferenceDto: EditConferenceDto,
    @Headers('authorization') apiKey: string,
    @Param('conference_id') conferenceId: string
  ): Promise<IConference> {
    apiKey = apiKey.substr(7);

    const conference = await this.conferencesService.findById(conferenceId);
    const user = await this.usersService.findBy({ apiKey })[0];

    if (user['_id'] !== conference['_id']) {
      throw new BadRequestException({
        statusCode: HttpStatus.FORBIDDEN,
        errorMessage: 'Not enough permissions'
      });
    }

    if (editConferenceDto.avatar) {
      if (conference.avatar) {
        this.imageService.removeImage(conference.avatar);
      }

      const filename = this.hashService.getRandomHash() + '.' + this.imageService.getImageExtension(editConferenceDto.avatar);

      this.imageService.saveImage(editConferenceDto.avatar, filename);
      editConferenceDto.avatar = filename;
    } else if (editConferenceDto.avatar === null) {
      this.imageService.removeImage(conference.avatar);
    }

    const updatedConference = await this.conferencesService.updateModel(conference, editConferenceDto);

    if (updatedConference.avatar) {
      updatedConference.avatar = this.imageService.getImage(updatedConference.avatar);
    }

    return updatedConference;
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['authorized'])
  @Post('byIds')
  async getConferencesByIds(@Body() body: string[]): Promise<IConference[]> {
    let conferences = await this.conferencesService.findByIds(body);

    conferences = conferences.map(conference => {
      if (conference.avatar) {
        conference.avatar = this.imageService.getImage(conference.avatar);
      }

      return conference;
    });

    return conferences;
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['authorized'])
  @Get(':conf_id/participants')
  async getParticipants(
    @Param('conf_id') confId: string
  ): Promise<IUser[]> {
    const conf = await this.conferencesService.findById(confId);
    const participantIds = conf.participants.map(part => part.toString());

    const participants = await this.usersService.findByIds(participantIds);

    return participants;
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['authorized'])
  @Post(':conf_id/participants')
  async addParticipant(
    @Body() dto: { userOuterId: string },
    @Param('conf_id') confId: string
  ): Promise<IConference> {
    const conf = await this.conferencesService.findById(confId);
    const user = await this.usersService.findOneBy({ outerId: dto.userOuterId });

    await this.usersService.updateModel(
      user,
      { conferences: user.conferences.concat(new Types.ObjectId(conf['_id'])) }
    );

    return this.conferencesService.updateModel(
      conf,
      { participants: conf.participants.concat(new Types.ObjectId(user['_id'])) }
    );
  }

  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['authorized'])
  @Post()
  async create(
    @Body() createConferenceDto: CreateConferenceDto,
    @Headers('authorization') apiKey: string
  ): Promise<IConference> {
    if (createConferenceDto.avatar) {
      const filename = this.hashService.getRandomHash() + '.' + this.imageService.getImageExtension(createConferenceDto.avatar);

      this.imageService.saveImage(createConferenceDto.avatar, filename);
      createConferenceDto.avatar = filename;
    } else {
      createConferenceDto.avatar = null;
    }

    apiKey = apiKey.substr(7);
    const user = await this.usersService.findOneBy({ apiKey });

    createConferenceDto.ownerUserId = user['_id'];

    const createdConference = await this.conferencesService.create(createConferenceDto);

    const newUserConferences = user.conferences;
    newUserConferences.push(createdConference['_id'])

    this.usersService.updateModel(user, {
      conferences: newUserConferences
    });
    
    if (createdConference.avatar) {
      createdConference.avatar = this.imageService.getImage(createdConference.avatar);
    }

    return createdConference;
  }
}
