import { Injectable } from '@nestjs/common';
import { CreatePetDto } from '../dto/pet.dto';
import { Pet } from '../pet.schema';
import { PetRepository } from './pet.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PetRepositoryService implements PetRepository {
  constructor(@InjectModel(Pet.name) private petModel: Model<Pet>) {}

  async create(createPet: CreatePetDto): Promise<Pet> {
    const createdPet = new this.petModel(createPet);
    return await createdPet.save();
  }
  async findAll(): Promise<Pet[]> {
    return this.petModel.find().exec();
  }
  async findAllById(petId: string): Promise<Pet> {
    return this.petModel.findById(petId);
  }
  async removeById(petId: string): Promise<void> {
    await this.petModel.findByIdAndRemove(petId);
  }
}
