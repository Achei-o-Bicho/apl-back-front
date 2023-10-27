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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecognizePetService } from './recognize-pet.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { PetsService } from '../pets/pet.service';
import { UsersService } from '../users/users.service';
import { IUser } from '../users/interface/user.interface';
import { User } from '../users/schema/user.schema';

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
    @Res() res: Response,
  ) {
    try {
      const recognize = await this.recognizeService.getStatusRecognizer(
        endToEndParam,
      );

      if (!recognize || recognize == null) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'EndToEnd not found' });
      }

      const { endToEnd, resultRecognator, url } = recognize;

      const resultsRecognator =
        resultRecognator && resultRecognator.length > 0
          ? resultRecognator.map(async (pet) => {
              this.logger.log(pet);
              const petFinded = await this.petService.findAllById(pet);
              if (!petFinded) return null;
              const { contact, name }: User =
                await this.userService.findUserByPetId(pet);
              this.logger.log(contact, name);
              return {
                pet: petFinded,
                user: {
                  name,
                  phone: contact.phone,
                },
              };
            })
          : null;

      return res.status(HttpStatus.OK).json({
        endToEnd,
        results: resultsRecognator,
        url,
      });
    } catch (err) {
      this.logger.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
