import { Injectable, NotFoundException, Param, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';
import { IUser } from './interface/user.interface';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<IUser[]> {
    const userData = await this.userModel.find().exec();
    if (userData.length == 0 || !userData)
      throw new NotFoundException('Users data not found');
    return userData;
  }

  async findById(userId: string): Promise<IUser> {
    const userData = await this.userModel.findById(userId);
    if (!userData) throw new NotFoundException(`User ${userId} not found`);
    return userData;
  }

  async updateUserById(
    userId: string,
    updateStudentDto: CreateUserDto,
  ): Promise<IUser> {
    const existingUser = await this.userModel.findByIdAndUpdate(
      userId,
      updateStudentDto,
      { new: true },
    );
    if (!existingUser) throw new NotFoundException(`User ${userId} not found`);
    return existingUser;
  }

  async deleteUserById(userId: string): Promise<IUser> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);
    if (!deletedUser) throw new NotFoundException(`User ${userId} not found`);
    return deletedUser;
  }
}
