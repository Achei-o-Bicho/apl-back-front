import { IContact } from '../dto/user.dto';

export class IUser {
  document: string;
  name: string;
  contact: IContact;
  password: string;
}
