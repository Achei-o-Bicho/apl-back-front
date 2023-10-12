import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema()
export class RecognizePet extends Document {
  @Prop()
  endToEnd: string;

  @Prop()
  resultRecognator: string;

  @Prop()
  url: string;
}

export const RecognizePetSchema = SchemaFactory.createForClass(RecognizePet);

export type UserDocument = RecognizePet & Document;

export type RecognizePetSchema = HydratedDocument<RecognizePet>;
