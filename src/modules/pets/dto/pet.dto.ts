import { ApiProperty } from '@nestjs/swagger';
import { AnimalGender } from '../enum/animalGender.enum';
import { TypePet } from '../enum/typePet.enum';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePetDto {
  @ApiProperty({
    type: String,
    description: 'Name of pet',
    example: 'Zeus',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: AnimalGender, example: AnimalGender.M })
  @IsNotEmpty()
  gender: AnimalGender;

  @ApiProperty({
    type: String,
    description: 'Breed of animal',
    example: 'Husky',
  })
  breed: string;

  @ApiProperty({
    description: 'Birthday of pet',
    example: '25/07/2022',
  })
  @Transform(({ value }) => new Date(value), { toClassOnly: true }) // Transforma a string em Date
  birthday: Date;

  @ApiProperty({
    enum: TypePet,
    description: 'Type of pet',
    example: TypePet.CAT,
  })
  type: TypePet;

  description?: string;

  userId: string;
}
