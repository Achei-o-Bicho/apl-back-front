import { ContactDto } from '../dto/user.dto';

export class IUser {
  document: string;
  name: string;
  contact: ContactDto;
  password: string;
}
