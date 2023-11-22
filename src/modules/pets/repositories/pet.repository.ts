import { CreatePetDto } from '../dto/create-pet.dto';
import { PetDto } from '../dto/pet.dto';
import { Pet } from '../pet.schema';

export abstract class PetRepository {
  abstract create(createPet: CreatePetDto): Promise<Pet>;
  abstract findAll(): Promise<Pet[]>;
  abstract findAllById(petId: string): Promise<PetDto>;
  abstract removeById(petId: string): Promise<Pet>;
  abstract findAllByIdPet(petId: string): Promise<Pet>;
  abstract getImagesFromPetById(
    petId: string,
  ): Promise<{ location: string; image: string }[]>;
  abstract updateImageAnimal(
    imageUrl: string,
    petId: string,
    base64: string,
  ): Promise<Pet>;
}
