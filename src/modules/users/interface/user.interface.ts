import { Pet } from 'src/modules/pets/pet.schema';
import { ContactDto } from '../dto/user.dto';

export class IUser {
  _id: string;
  document: string;
  name: string;
  contact: ContactDto;
  password: string;
  borough: string;
  zipCode: string;
  pets: Pet[];
  roles: string[];
}
