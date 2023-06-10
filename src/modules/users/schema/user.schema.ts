import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class User{
  @Prop({require: true})
  id: Uint8Array[16];

  @Prop({require: true})
  document: string;

  @Prop()
  name: string;

  @Prop()
  contact: string;
}

export const UserSchema = SchemaFactory.createForClass(User)
export type UserDocument = HydratedDocument<User>