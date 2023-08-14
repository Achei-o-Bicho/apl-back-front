import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
    const petFounded = this.petRepository.findAllById(petId);
    if (!petFounded) throw new NotFoundException(`Pet ${petId} not found`);
    return this.petRepository.findAllById(petId);
  }

  async removeById(petId: string): Promise<void> {
    const deletedPet = this.petRepository.removeById(petId);
    if (!deletedPet) throw new NotFoundException(`Pet ${petId} not found`);
    return this.petRepository.removeById(petId);
  }
}
