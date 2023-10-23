import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AnimalGender } from './enum/animalGender.enum';
import { TypePet } from './enum/typePet.enum';
import { HydratedDocument, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import * as autoIncrement from 'mongoose-plugin-autoinc';

export class ImagesPet {
  @Prop({ required: false })
  location: string;

  @Prop({ required: false })
  base64: string;
}

@Schema()
export class Pet {
  @Prop({ unique: true })
  petId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ enum: AnimalGender, required: true })
  gender: AnimalGender;

  @Prop({ required: false })
  breed: string;

  @Prop({ required: true })
  birthday: Date;

  @Prop({ enum: TypePet, required: false })
  type: TypePet;

  @Prop()
  pathImage: string;

  @Prop()
  description?: string;

  @Prop({
    type: [{ type: Object, ref: 'Pet' }],
    required: false,
  })
  images: Types.Array<ImagesPet>;
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
