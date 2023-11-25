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
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecognizePetService } from './recognize-pet.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';
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
    @Req() req: Request,
  ) {
    try {
      const userFromAuthorization = req['userFromAuthorization'];

      const [recognize] = await Promise.all([
        this.recognizeService.getStatusRecognizer(endToEndParam),
      ]);

      if (!recognize) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'EndToEnd not found' });
      }

      const { endToEnd, resultRecognator, url } = recognize;

      if (!resultRecognator) {
        return res.status(HttpStatus.OK).json({
          endToEnd,
          results: null,
          url,
        });
      }

      const pets: {
        pet: Pet | Omit<Pet, 'images'>;
        user: { name: string; phone: string; id: string };
      }[] = await Promise.all(
        resultRecognator.map(async (petId) => {
          try {
            const petFinded = await this.petService.findAllById(petId);

            if (!petFinded) return null;

            const userPet = await this.userService.findUserByPetId(petId);

            if (!userPet) return null;

            const { contact, name, _id } = userPet;

            if (!!showImage) {
              delete petFinded.images;
            }

            return {
              pet: petFinded,
              user: {
                name,
                phone: contact.phone,
                id: _id,
              },
              isOwner: userFromAuthorization.id === _id,
            };
          } catch (error) {
            this.logger.error(error);
            return null;
          }
        }),
      );

      const allNull = pets.every((pet) => pet === null);

      const results = allNull || !userFromAuthorization ? null : pets;

      return res.status(HttpStatus.OK).json({
        endToEnd,
        results: results,
        url,
      });
    } catch (err) {
      this.logger.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
