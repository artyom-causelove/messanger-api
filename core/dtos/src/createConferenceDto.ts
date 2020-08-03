export class CreateConferenceDto {
  name: string;
  avatar?: string;
  participants?: string[];
  ownerUserId: string;
}
