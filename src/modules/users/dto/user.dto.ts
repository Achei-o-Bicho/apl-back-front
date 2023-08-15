export class CreateUserDto {
  document: string;
  name: string;
  contact: IContact;
  password: string;
}

export interface IContact {
  emailAddress: string;
  ddd: string;
  phone: string;
}
