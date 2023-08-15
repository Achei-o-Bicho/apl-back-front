import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  Logger,
  Delete,
} from '@nestjs/common';
import { PetsService } from './pet.service';
import { Response } from 'express';
import { CreatePetDto } from './dto/pet.dto';

@Controller('pets')
export class PetsController {
  private readonly logger = new Logger(PetsController.name);
  constructor(private petService: PetsService) {}
  @Get(':/id')
  public async getPetById(@Param('id') id: string, @Res() res: Response) {
    try {
      const petFounded = await this.petService.findAllById(id);

      if (!petFounded) res.status(HttpStatus.NOT_FOUND);

      res.status(HttpStatus.OK).json(petFounded);
    } catch (err) {
      this.logger.error(err);
      res.status(500);
    }
  }

  @Get()
  public async getAllPets(@Res() res: Response) {
    try {
      const pets = await this.petService.findAll();

      if (!pets) res.status(HttpStatus.NO_CONTENT);

      res.status(HttpStatus.OK).json(pets);
    } catch (err) {
      this.logger.error(err);
      res.status(500);
    }
  }

  @Post()
  public async postPet(@Body() createPet: CreatePetDto, @Res() res: Response) {
    try {
      const petCreated = await this.petService.create(createPet);

      res.status(HttpStatus.CREATED).json(petCreated);
    } catch (err) {
      this.logger.error(err);
      res.status(500);
    }
  }

  @Delete('/:id')
  public async delete(@Res() res, @Param('id') idPet: string) {
    try {
      const petDeleted = await this.petService.removeById(idPet);

      res.status(HttpStatus.NO_CONTENT);
    } catch (err) {
      this.logger.error(err);
      res.status(500);
    }
  }
}
