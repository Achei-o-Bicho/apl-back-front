import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { PetsService } from './pet.service';
import { Response } from 'express';
import { CreatePetDto } from './dto/pet.dto';

@Controller('pets')
export class PetsController {
  constructor(private petService: PetsService) {}
  @Get(':/id')
  public async getPetById(@Param('id') id: string, @Res() res: Response) {
    const petFounded = await this.petService.findAllById(id);

    if (!petFounded) res.status(HttpStatus.NOT_FOUND);

    res.status(HttpStatus.OK).json(petFounded);
  }

  @Get()
  public async getAllPets(@Res() res: Response) {
    const pets = await this.petService.findAll();

    if (!pets) res.status(HttpStatus.NO_CONTENT);

    res.status(HttpStatus.OK).json(pets);
  }

  @Post()
  public async postPet(@Body() createPet: CreatePetDto, @Res() res: Response) {
    const petCreated = await this.petService.create(createPet);

    res.status(HttpStatus.CREATED).json(petCreated);
  }
}
