import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IContact } from '../dto/user.dto'; // Verifique se o caminho para o arquivo está correto

@Schema()
export class User extends Document {
  @Prop({ default: uuidv4 })
  userId: string;

  @Prop({ required: true })
  document: string;

  @Prop()
  name: string;

  @Prop({ type: Object }) // Use 'Object' como tipo para campos complexos como objetos personalizados
  contact: IContact;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
