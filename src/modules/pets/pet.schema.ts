import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AnimalGender } from './enum/animalGender.enum';
import { TypePet } from './enum/typePet.enum';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Pet {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: AnimalGender, required: true })
  gender: AnimalGender;

  @Prop({ required: true })
  breed: string;

  @Prop({ required: true })
  borough: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ enum: TypePet })
  type: TypePet;

  @Prop()
  pathImage: string;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
export type PetDocument = HydratedDocument<Pet>;
