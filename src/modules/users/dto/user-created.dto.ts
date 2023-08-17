import { CreateUserDto } from './user.dto';

export class UserCreatedDto {
  message: string;
  newUser: CreateUserDto;
}
