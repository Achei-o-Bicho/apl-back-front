import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ContactDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Pet } from 'src/modules/pets/pet.schema';
import { Roles } from "../roles.enum";

@Schema()
export class User extends Document {
  @Prop({ default: uuidv4 })
  userId: string;

  @Prop({ required: true })
  document: string;

  @Prop()
  name: string;

  @Prop({ type: Object })
  contact: ContactDto;

  @Prop()
  borough: string;

  @Prop()
  zipCode: string;

  @Prop()
  password: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
    required: false,
  })
  pets: Types.Array<Pet>;

  @Prop({
    type: [{ type: mongoose.Schema.Types.String }],
    required: false,
    default: [Roles.USER],
  })
  roles: Types.Array<string>;

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export type UserDocument = User & Document;
