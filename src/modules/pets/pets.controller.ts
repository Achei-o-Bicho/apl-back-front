import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  Delete,
  Logger,
} from '@nestjs/common';
import { PetsService } from './pet.service';
import { Response } from 'express';
import { CreatePetDto } from './dto/pet.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Pets')
@Controller('pets')
export class PetsController {
  private readonly logger = new Logger(PetsController.name);

  constructor(private petService: PetsService) {}

  @ApiOperation({ summary: 'Get a pet by ID' })
  @ApiResponse({ status: 200, description: 'Pet found', type: CreatePetDto })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @Get(':id')
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

  @ApiOperation({ summary: 'Get all pets' })
  @ApiResponse({
    status: 200,
    description: 'List of pets',
    type: [CreatePetDto],
  })
  @ApiResponse({ status: 204, description: 'No pets found' })
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

  @ApiOperation({ summary: 'Create a new pet' })
  @ApiResponse({
    status: 201,
    description: 'Pet created successfully',
    type: CreatePetDto,
  })
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

  @ApiOperation({ summary: 'Delete a pet by ID' })
  @ApiResponse({ status: 204, description: 'Pet deleted successfully' })
  @Delete(':id')
  public async delete(@Res() res, @Param('id') idPet: string) {
    try {
      await this.petService.removeById(idPet);

      res.status(HttpStatus.NO_CONTENT);
    } catch (err) {
      this.logger.error(err);
      res.status(500);
    }
  }
}
