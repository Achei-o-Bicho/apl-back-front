import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';
import { IUser } from './interface/user.interface';
import { User } from './schema/user.schema';
import { LoginDto } from './dto/login.dto';
import { SendWhatsappService } from '../send-message/send-whatsapp.service';
import { generateTokenOTP } from 'src/utils/token';
import { Pet } from '../pets/pet.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly sendMessageService: SendWhatsappService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const createdUser = new this.userModel(createUserDto);
    if (await this.userExists(createUserDto.contact.emailAddress)) return null;
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

  async findUserByCpf(cpf: string): Promise<IUser> {
    const user = await this.userModel.findOne({ document: cpf });
    if (!user) throw new NotFoundException(`User ${cpf} not found`);
    return user;
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

  async login(loginDto: LoginDto): Promise<IUser> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) throw new NotFoundException(`User ${email} not found`);

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new NotFoundException(); // Senha incorreta
    }

    return user;
  }

  async findByEmailAddress(emailAddress: string): Promise<IUser> {
    const user = this.userModel
      .findOne({ 'contact.emailAddress': emailAddress })
      .exec();

    if (!user) throw new NotFoundException(`User ${emailAddress} not found`);

    return user;
  }

  async validateNumberUser(number: string): Promise<string> {
    try {
      const otpToken = generateTokenOTP(number);
      await this.sendMessageService.sendSMS(number, otpToken);

      return otpToken;
    } catch (err) {}
  }

  async addPetToUser(pet: Pet, userId: string) {
    const filter = { _id: userId };
    const update = { $push: { pets: pet } };

    const updatedUser = await this.userModel.findOneAndUpdate(filter, update, {
      new: true,
    });

    return updatedUser;
  }

  async getPetsOfUser(userId: string) {
    const ownerWithPets = await this.userModel
      .findById(userId)
      .populate('pets');
    return ownerWithPets;
  }

  async findUserByPetId(petId: string) {
    const user = await this.userModel
      .findOne({ pets: new mongoose.Types.ObjectId(petId)._id })
      .exec();
    return user;
  }

  async userExists(userEmail: string): Promise<boolean> {
    const user = await this.findByEmailAddress(userEmail);

    if (user) {
      return true;
    }

    return false;
  }
}
