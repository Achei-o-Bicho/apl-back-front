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
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PetsService } from './pet.service';
import { Response } from 'express';
import { CreatePetDto } from './dto/create-pet.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Pets')
@Controller('pets')
export class PetsController {
  private readonly logger = new Logger(PetsController.name);

  constructor(private petService: PetsService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a pet by ID' })
  @ApiResponse({ status: 204, description: 'Pet deleted successfully' })
  @Delete(':id')
  public async delete(@Res() res, @Param('id') idPet: string, @Req() req) {
    const user = req.user;

    try {
      await this.petService.removeById(idPet, user.userId);

      res.status(HttpStatus.NO_CONTENT).json();
    } catch (err) {
      this.logger.error(err);
      if (err.response) {
        return res
          .status(err.response.statusCode)
          .json({ message: err.response.message });
      } else {
        res.status(500).json();
      }
    }
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all images from pet id' })
  @ApiResponse({ status: 200, description: 'Images' })
  @Post('images')
  public async getAllImagesFromPetById(
    @Res() res,
    @Body() getImages: { idPet: string },
  ) {
    try {
      const imagesFromPet = await this.petService.getImagesFromPet(
        getImages.idPet,
      );

      res.status(HttpStatus.OK).json(imagesFromPet);
    } catch (err) {
      this.logger.error(err);
      res.status(500).json();
    }
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Link images with the dog' })
  @ApiResponse({ status: 200, description: 'Image linked successfully' })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @UseInterceptors(FileInterceptor('image'))
  @Post(':idPet/save-image')
  public async linkImagePet(
    @Param('idPet') idPet: string,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const petUpdated = await this.petService.saveImagePet(image, idPet);

      await this.petService.saveImagePetDirectoryOnly(image, idPet);

      if (!petUpdated) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Pet not found' });
      }

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Image linked successfully', pet: petUpdated });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal Server Error' });
    }
  }
}
