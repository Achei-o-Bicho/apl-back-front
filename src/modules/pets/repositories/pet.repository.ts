import { CreatePetDto } from '../dto/pet.dto';
import { Pet } from '../pet.schema';

export abstract class PetRepository {
  abstract create(createPet: CreatePetDto): Promise<Pet>;
  abstract findAll(): Promise<Pet[]>;
  abstract findAllById(petId: string): Promise<Pet>;
  abstract removeById(petId: string): Promise<void>;
  abstract updateImageAnimal(imageUrl: string, petId: string): Promise<Pet>;
}
