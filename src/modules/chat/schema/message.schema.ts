import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../users/schema/user.schema';

export type MessageDocument = Message & Document;

export interface Sender {
  name: string;
  id: string;
}

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: true,
})
export class Message {
  @Prop({ required: true })
  message: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ default: false })
  isOwner: boolean;
}

const MessageSchema = SchemaFactory.createForClass(Message);

export { MessageSchema };
