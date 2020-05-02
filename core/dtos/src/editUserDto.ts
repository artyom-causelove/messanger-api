export class EditUserDto {
  personalId?: string;
  password?: string;
  nickname?: string;
  age?: number;
  status?: string;
  lastVisit?: Date;
  apiKey?: string;
  avatar?: string;
  conferences?: string[];
}
