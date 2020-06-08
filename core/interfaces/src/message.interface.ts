interface IMessage {
  text: string,
  date: Date,
  isReadSomeOne: boolean,
  isReadUsers: Array<string>,
  userId: any,
  conferenceId: any
}

export default IMessage;
