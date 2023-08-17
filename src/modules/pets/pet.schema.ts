import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AnimalGender } from './enum/animalGender.enum';
import { TypePet } from './enum/typePet.enum';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import * as autoIncrement from 'mongoose-plugin-autoinc';

@Schema()
export class Pet {
  @Prop({ unique: true })
  petId: number;

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

  @Prop()
  description?: string;

  @Prop()
  image: string;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
export type PetDocument = HydratedDocument<Pet>;

PetSchema.plugin(autoIncrement.plugin, {
  model: 'Pet',
  field: 'petId',
  startAt: 134548,
  incrementBy: 1,
});

export const PetModel = mongoose.model<PetDocument>('Pet', PetSchema);
