import { Injectable, Logger } from '@nestjs/common';
import { Pet } from './pet.schema';
import { CreatePetDto } from './dto/pet.dto';
import { PetRepositoryService } from './repositories/pet.repository.service';

@Injectable()
export class PetsService {
  private readonly logger = new Logger(PetsService.name);
  constructor(private readonly petRepository: PetRepositoryService) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    this.logger.log('Creating Pet');
    return await this.petRepository.create(createPetDto);
  }

  async findAll(): Promise<Pet[]> {
    this.logger.log('Getting All Pets');
    return await this.petRepository.findAll();
  }

  async findAllById(petId: string): Promise<Pet> {
    this.logger.log('Getting Pet by id:' + petId);
    return this.petRepository.findAllById(petId);
  }

  async removeById(petId: string): Promise<void> {
    this.logger.log('Removing Pet by id:' + petId);
    return this.petRepository.removeById(petId);
  }
}
