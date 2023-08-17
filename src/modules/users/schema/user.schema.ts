import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ContactDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';

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
  password: string;

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
