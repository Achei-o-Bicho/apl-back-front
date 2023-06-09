import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { PetsService } from './pet.service';
import { Response } from 'express';

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
}
