interface IConference {
  name: string,
  date: Date,
  avatar: string,
  ownerUserId: any,
  messageBlocks: string[],
  participants: string[]
}

export default IConference;
