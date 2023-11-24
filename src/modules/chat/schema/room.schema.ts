import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Message, MessageSchema } from './message.schema';
import * as mongoose from 'mongoose';
import { User, UserSchema } from '../../users/schema/user.schema';

export type RoomDocument = Room & Document;

@Schema({
  timestamps: true,
})
export class Room {
  @Prop({
    type: String,
    unique: false,
    default: function genUUID() {
      return uuidv4();
    },
  })
  _id: string;

  @Prop({ type: UserSchema, ref: 'User' })
  receiver: User;

  @Prop({ type: UserSchema, ref: 'User' })
  sender: User;

  @Prop({ type: [{ type: MessageSchema, ref: 'Message' }] })
  messages: Message[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
