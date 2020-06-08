import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { UsersService } from '@messanger/src/users/users.service';
import { MessagesService } from '@messanger/src/messages/messages.service';
import { ConferencesService } from '@messanger/src/conferences/conferences.service';
import { MessageBlocksService } from '@messanger/src/message-blocks/message-blocks.service';

import { CreateMessageBlockDto, CreateMessageDto } from '@messanger/dtos';

class OnlineConference {
  confId: string;
  clients: Socket[];

  constructor(
    confId: string,
    clients: Socket[]
  ) { 
    this.confId = confId;
    this.clients = clients;
  }
}

class OnlineUser {
  userId: string;
  client: Socket;
  conferences: OnlineConference[];

  constructor(
    userId: string,
    client: Socket,
    conferences: OnlineConference[]
  ) { 
    this.userId = userId;
    this.client = client;
    this.conferences = conferences;
  }
}

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  conferences: OnlineConference[] = [];
  clients: OnlineUser[] = [];

  private logger: Logger = new Logger('AppGateway');

  constructor(
    private usersService: UsersService,
    private messageBlockService: MessageBlocksService,
    private messagesService: MessagesService,
    private conferencesService: ConferencesService
  ) { }
  
  @SubscribeMessage('messageToConf')
  async handleMessage(client: Socket, payload: {
    confId: string,
    text: string
  }): Promise<void> {
    const userObj = this.clients.find(c => c.client.id === client.id);
    const conf = userObj.conferences.find(c => c.confId.toString() === payload.confId);
    
    const confModel = await this.conferencesService.findById(payload.confId);
    const confLastMessageBlockId = confModel.messageBlocks[confModel.messageBlocks.length - 1];
    const confLastMessageBlock = await this.messageBlockService.findById(confLastMessageBlockId);
    const createMessageDto = new CreateMessageDto();
    createMessageDto.conferenceId = payload.confId;
    createMessageDto.date = new Date();
    createMessageDto.isReadSomeOne = false;
    createMessageDto.isReadUsers = [userObj.userId];
    createMessageDto.text = payload.text;
    createMessageDto.userId = userObj.userId;
    const newMessage = await this.messagesService.create(createMessageDto);
    let targetMessageBlock = null;
    
    if (confLastMessageBlock !== null && confLastMessageBlock.messages.length !== 10) {
      targetMessageBlock = confLastMessageBlock;
      
      targetMessageBlock = await this.messageBlockService.updateModel(targetMessageBlock, {
        messages: [].concat(newMessage['_id'], targetMessageBlock.messages)
      });
    } else {
      const createMessageBlockDto = new CreateMessageBlockDto();
      createMessageBlockDto.number = confLastMessageBlock ? confLastMessageBlock.number + 1 : 0;
      createMessageBlockDto.messages = [newMessage['_id']];
      createMessageBlockDto.conferenceId = payload.confId;
      
      targetMessageBlock = await this.messageBlockService.create(createMessageBlockDto);

      this.conferencesService.updateModel(confModel, {
        messageBlocks: confModel.messageBlocks.concat(targetMessageBlock['_id'])
      });
    }

    conf.clients.forEach(p => p.emit('messageFromConf', {
      confId: newMessage.conferenceId,
      text: newMessage.text,
      userId: newMessage.userId,
      isReadSomeOne: newMessage.isReadSomeOne,
      isReadUsers: newMessage.isReadUsers,
      date: newMessage.date,
      _id: newMessage['_id']
    }));
  }

  afterInit() {
    this.logger.log('Server: socket server initialized');
  }

  handleDisconnect(client: Socket) {
    const offOnlineUser: OnlineUser = this.clients.find(c => c.client.id === client.id);

    offOnlineUser.conferences.forEach(conf => {
      const existUserConf: OnlineConference = this.conferences.find(c => c.confId === conf.confId);

      if (existUserConf.clients.length === 1) {
        this.conferences = this.conferences.filter(c => c.confId !== conf.confId);
      } else {
        existUserConf.clients = existUserConf.clients.filter(c => c.id !== client.id);
      }
    });

    this.clients = this.clients.filter(c => c.client.id !== client.id);
    this.logger.log(`${client.id}: disconnected via socket`);
  }

  async handleConnection(client: Socket) {
    const apiKey = client.handshake.query.apiKey;
    const user = await this.usersService.findOneBy({ apiKey });

    const userOnlineConfs: OnlineConference[] = [];

    user.conferences.forEach(confId => {
      const conf = this.conferences.find(c => confId.toString() === c.confId.toString());

      if (conf) {
        conf.clients.push(client);
        userOnlineConfs.push(conf);
      } else {
        const newOnlineConf = new OnlineConference(confId, [client]);

        this.conferences.push(newOnlineConf);
        userOnlineConfs.push(newOnlineConf);
      }
    });

    
    this.clients.push(new OnlineUser(user['_id'], client, userOnlineConfs));
    this.logger.log(`${client.id}: connected via socket`);
  }
}
