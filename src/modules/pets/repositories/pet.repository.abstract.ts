import { CreatePetDto } from '../dto/pet.dto';
import { Pet } from '../pet.schema';

export abstract class IPetRepository {
  abstract create(createPet: CreatePetDto): Promise<Pet>;
  abstract findAll(): Promise<Pet[]>;
  abstract findAllById(petId: string): Promise<Pet>;
  abstract removeById(petId: string): Promise<void>;
}
