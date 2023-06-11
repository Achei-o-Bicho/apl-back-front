import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pet } from './pet.schema';
import { Model } from 'mongoose';
import { CreatePetDto } from './dto/pet.dto';

@Injectable()
export class PetsService {
  private readonly logger = new Logger(PetsService.name);
  constructor(@InjectModel(Pet.name) private petModel: Model<Pet>) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const createdPet = new this.petModel(createPetDto);
    this.logger.log('Creating Pet');
    return await createdPet.save();
  }

  async findAll(): Promise<Pet[]> {
    this.logger.log('Getting All Pets');
    return this.petModel.find().exec();
  }

  async findAllById(petId: string): Promise<Pet> {
    this.logger.log('Getting Pet by id:' + petId);
    return this.petModel.findById(petId);
  }

  async removeById(petId: string): Promise<void> {
    this.logger.log('Removing Pet by id:' + petId);
    await this.petModel.findByIdAndRemove(petId);
  }
}
