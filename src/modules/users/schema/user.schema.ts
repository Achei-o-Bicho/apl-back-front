import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class User {
  @Prop({ default: uuidv4 })
  userId: string;

  @Prop({ require: true })
  document: string;

  @Prop()
  name: string;

  @Prop()
  contact: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
