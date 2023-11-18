import { AnimalGender } from '../enum/animalGender.enum';
import { TypePet } from '../enum/typePet.enum';
import { ImagesPetDto } from './images-pet.dto';

export interface PetDto {
  petId: string;
  name: string;
  gender: AnimalGender;
  breed: string;
  birthday: Date;
  type: TypePet;
  pathImage: string;
  description: string;
  images: ImagesPetDto[];
}
