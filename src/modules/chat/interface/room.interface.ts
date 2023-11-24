import { IUser } from '../../users/interface/user.interface';
import { IMessage } from './message.interface';

export interface IRoom {
  _id: string;
  receiver: IUser;
  sender: IUser;
  message: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}