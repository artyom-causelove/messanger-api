export class CreateMessageDto {
  text: string;
  date: Date;
  isReadSomeOne: boolean;
  isReadUsers: Array<string>;
  userId: string;
  conferenceId: string;
}
