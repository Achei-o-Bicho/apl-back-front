import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RecognizePet } from './schema/recognize-pet.schema';
import { Model } from 'mongoose';
import { LambdaService } from '../lambda/lambda.service';
import { gerarEndToEnd } from 'src/utils/endToEnd';
import { RecognizePetDto } from './dto/recognize-pet.dto';
import { ImageResizeService } from '../resize-image/resize-image.service';

@Injectable()
export class RecognizePetService {
  constructor(
    @InjectModel(RecognizePet.name)
    private recognizePetModel: Model<RecognizePet>,
    private readonly lambdaService: LambdaService,
    private readonly imageResizeService: ImageResizeService,
  ) {}

  async recognize(image: Express.Multer.File) {
    const { buffer, originalname, mimetype } = image;

    const endToEnd = gerarEndToEnd();

    const formatFileName = `recognator/${endToEnd}/${originalname}`;

    const imageResized = await this.imageResizeService.resizeImage(buffer);

    const imageBufferBase64 = imageResized.toString('base64');

    const result = await this.lambdaService.sendImageToGoogleFunction(
      imageBufferBase64,
      formatFileName,
      mimetype,
    );

    const url = result.location;

    if (!url) {
      throw new Error('Failed to save in S3 using Lambda');
    }

    const recognizePetModel: RecognizePetDto = {
      endToEnd: endToEnd,
      resultRecognator: null,
      url: url,
    };

    const recognizeMongo = new this.recognizePetModel(recognizePetModel);
    const rec = await recognizeMongo.save();
    return rec;
  }

  async getStatusRecognizer(endToEnd: string) {
    const result = await this.recognizePetModel.findOne({ endToEnd: endToEnd });

    return result;
  }
}
