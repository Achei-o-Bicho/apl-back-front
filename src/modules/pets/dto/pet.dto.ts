import { AnimalGender } from '../enum/animalGender.enum';
import { TypePet } from '../enum/typePet.enum';
import { IsNotEmpty } from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  gender: AnimalGender;

  @IsNotEmpty()
  breed: string;

  @IsNotEmpty()
  borough: string;

  @IsNotEmpty()
  zipCode: string;

  @IsNotEmpty()
  type: TypePet;
}
