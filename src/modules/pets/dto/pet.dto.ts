import { AnimalGender } from '../enum/animalGender.enum';
import { TypePet } from '../enum/typePet.enum';

export class CreatePetDto {
  name: string;
  gender: AnimalGender;
  breed: string;
  borough: string;
  zipCode: string;
  type: TypePet;
}
