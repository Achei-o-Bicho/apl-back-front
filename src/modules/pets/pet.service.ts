import { Injectable, Logger } from '@nestjs/common';
import { Pet } from './pet.schema';
import { CreatePetDto } from './dto/pet.dto';
import { PetRepository } from './repositories/pet.repository';

@Injectable()
export class PetsService {
  constructor(private readonly petRepository: PetRepository) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    return await this.petRepository.create(createPetDto);
  }

  async findAll(): Promise<Pet[]> {
    return await this.petRepository.findAll();
  }

  async findAllById(petId: string): Promise<Pet> {
    return this.petRepository.findAllById(petId);
  }

  async removeById(petId: string): Promise<void> {
    return this.petRepository.removeById(petId);
  }
}
