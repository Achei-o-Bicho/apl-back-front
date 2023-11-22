import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecognizePetService } from './recognize-pet.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { PetsService } from '../pets/pet.service';
import { UsersService } from '../users/users.service';
import { Pet } from '../pets/pet.schema';

@ApiTags('Recognize')
@Controller('recognize')
export class RecognizePetController {
  private readonly logger = new Logger(RecognizePetController.name);

  constructor(
    private recognizeService: RecognizePetService,
    private petService: PetsService,
    private userService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Recognize Pet by Image' })
  @ApiResponse({ status: 200 })
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  public async linkImagePet(
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const { endToEnd, resultRecognator, url } =
        await this.recognizeService.recognize(image);
      res.status(HttpStatus.OK).json({
        endToEnd,
        resultRecognator,
        url,
      });
    } catch (err) {
      this.logger.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Check Status Recognize Pet' })
  @ApiResponse({ status: 200 })
  @Get(':endToEnd')
  public async getStatusResultRecognator(
    @Param('endToEnd') endToEndParam: string,
    @Query('showImage') showImage: boolean,
    @Res() res: Response,
  ) {
    try {
      const [recognize] = await Promise.all([
        this.recognizeService.getStatusRecognizer(endToEndParam),
      ]);

      if (!recognize) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'EndToEnd not found' });
      }

      const { endToEnd, resultRecognator, url } = recognize;

      const pets: {
        pet: Pet | Omit<Pet, 'images'>;
        user: { name: string; phone: string };
      }[] = await Promise.all(
        !resultRecognator || resultRecognator === null
          ? null
          : resultRecognator.map(async (petId) => {
              try {
                const petFinded = await this.petService.findAllById(petId);

                if (!petFinded) return null;

                const userPet = await this.userService.findUserByPetId(petId);

                if (!userPet) return null;

                const { contact, name } = userPet;

                if (!!showImage) {
                  delete petFinded.images;
                }

                return {
                  pet: petFinded,
                  user: {
                    name,
                    phone: contact.phone,
                  },
                };
              } catch (error) {
                this.logger.error(error);
                return null;
              }
            }),
      );

      return res.status(HttpStatus.OK).json({
        endToEnd,
        results: pets,
        url,
      });
    } catch (err) {
      this.logger.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
