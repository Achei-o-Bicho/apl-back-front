import { Injectable, NotFoundException } from '@nestjs/common';
import { Pet } from './pet.schema';
import { CreatePetDto } from './dto/pet.dto';
import { PetRepository } from './repositories/pet.repository';
import { AwsService } from '../aws/aws.service';
import { UsersService } from '../users/users.service';
import { Base64CompressionService } from '../compress-images/compress.service';
import { ImageResizeService } from '../resize-image/resize-image.service';

@Injectable()
export class PetsService {
  constructor(
    private readonly petRepository: PetRepository,
    private readonly awsService: AwsService,
    private readonly usersService: UsersService,
    private readonly compressImage: Base64CompressionService,
    private readonly imageResizeService: ImageResizeService,
  ) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    return await this.petRepository.create(createPetDto);
  }

  async findAll(): Promise<Pet[]> {
    return await this.petRepository.findAll();
  }

  async findAllById(petId: string): Promise<Pet> {
    const petFounded = this.petRepository.findAllById(petId);
    if (!petFounded) throw new NotFoundException(`Pet ${petId} not found`);
    return this.petRepository.findAllById(petId);
  }

  async removeById(petId: string): Promise<void> {
    const deletedPet = this.petRepository.removeById(petId);
    if (!deletedPet) throw new NotFoundException(`Pet ${petId} not found`);
    return this.petRepository.removeById(petId);
  }

  private async updateFieldImageInPet(
    imageUrl: string,
    petId: string,
    base64: string,
  ) {
    const pet = this.petRepository.updateImageAnimal(imageUrl, petId, base64);
    if (!pet) throw new NotFoundException(`Pet ${petId} not found`);
    return pet;
  }

  async saveImagePet(image: Express.Multer.File, petId: string) {
    const { buffer, originalname, mimetype } = image;

    const user = await this.usersService.findUserByPetId(petId);

    if (!user) {
      throw new NotFoundException(`User not found in pet`);
    }

    const formatFileName = `users/${user._id}/${petId}/${originalname}`;

    const result = await this.awsService.uploadFile(
      buffer,
      formatFileName,
      mimetype,
    );

    const url = result.Location;

    const imageResized = await this.imageResizeService.resizeImage(buffer);

    const imageBufferBase64 = imageResized.toString('base64');

    await this.updateFieldImageInPet(url, petId, imageBufferBase64);

    return { url: url, image: imageBufferBase64 };
  }

  async getImagesFromPet(petId: string) {
    const imagesFromPet = await this.petRepository.getImagesFromPetById(petId);

    return { images: imagesFromPet };
  }
}
