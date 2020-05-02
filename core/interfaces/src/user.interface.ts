interface IUser {
  personalId: string,
  nickname: string,
  password: string,
  age: number,
  status: string,
  lastVisit: Date,
  apiKey: string,
  roles: string[],
  avatar: string,
  conferences: string[]
}

export default IUser;
