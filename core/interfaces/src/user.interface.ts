interface IUser {
  personalId: string,
  outerId: any,
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
