import { IUser } from '../interface/user.interface';

export class DeleteUserResponseDto {
  message: string;
  deletedUser: IUser;
}
