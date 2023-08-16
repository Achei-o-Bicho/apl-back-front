import { ApiProperty } from '@nestjs/swagger';
import { AnimalGender } from '../enum/animalGender.enum';
import { TypePet } from '../enum/typePet.enum';
import { IsNotEmpty } from 'class-validator';

export class CreatePetDto {
  @ApiProperty({
    type: String,
    description: 'Name of pet',
    example: 'Zeus',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: AnimalGender, example: 'Male' })
  @IsNotEmpty()
  gender: AnimalGender;

  @ApiProperty({
    type: String,
    description: 'Breed of animal',
    example: 'Husky',
  })
  @IsNotEmpty()
  breed: string;

  @ApiProperty({
    type: String,
    description: 'Borough where the pet is located',
    example: 'Consolação',
  })
  @IsNotEmpty()
  borough: string;

  @ApiProperty({
    type: String,
    description: 'ZipCode where the pet is located',
    example: '01414-001',
  })
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({
    type: TypePet,
    description: 'Type of pet',
    example: 'Cat',
  })
  @IsNotEmpty()
  type: TypePet;
}
