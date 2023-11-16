import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Message, MessageSchema } from './message.schema';

export type RoomDocument = Room & Document;

@Schema()
export class Room {
  @Prop({
    type: String,
    unique: false,
    default: function genUUID() {
      return uuidv4();
    },
  })
  _id: string;

  @Prop({ type: [{ type: MessageSchema, ref: 'Message' }] })
  messages: Message[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
