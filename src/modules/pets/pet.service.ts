import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pet } from './pet.schema';
import { Model } from 'mongoose';
import { CreatePetDto } from './dto/pet.dto';

@Injectable()
export class PetsService {
  constructor(@InjectModel(Pet.name) private petModel: Model<Pet>) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    const createdPet = new this.petModel(createPetDto);
    return createdPet.save();
  }

  async findAll(): Promise<Pet[]> {
    return this.petModel.find().exec();
  }

  async findAllById(petId: string): Promise<Pet> {
    return this.petModel.findById(petId);
  }

  async removeById(petId: string): Promise<void> {
    this.petModel.findByIdAndRemove(petId);
  }
}
