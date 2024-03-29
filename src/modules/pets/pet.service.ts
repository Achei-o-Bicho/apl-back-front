import { Injectable, NotFoundException } from '@nestjs/common';
import { Pet } from './pet.schema';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetRepository } from './repositories/pet.repository';
import { UsersService } from '../users/users.service';
import { ImageResizeService } from '../resize-image/resize-image.service';
import { LambdaService } from '../lambda/lambda.service';
import { PetDto } from './dto/pet.dto';

@Injectable()
export class PetsService {
  constructor(
    private readonly petRepository: PetRepository,
    private readonly usersService: UsersService,
    private readonly imageResizeService: ImageResizeService,
    private readonly lambdaService: LambdaService,
  ) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    return await this.petRepository.create(createPetDto);
  }

  async findAll(): Promise<Pet[]> {
    return await this.petRepository.findAll();
  }

  async findAllById(petId: string): Promise<PetDto> {
    try {
      const petFounded = await this.petRepository.findAllById(petId);
      return {
        _id: petFounded._id,
        petId: petFounded.petId,
        name: petFounded.name,
        gender: petFounded.gender,
        breed: petFounded.breed,
        birthday: petFounded.birthday,
        type: petFounded.type,
        pathImage: petFounded.pathImage,
        description: petFounded.description,
        images: petFounded.images,
      };
    } catch (error) {
      throw new NotFoundException(`Pet ${petId} not found`);
    }
  }

  async removeById(petId: string): Promise<Pet> {
    const user = await this.usersService.findUserByPetId(petId);

    if (!user) {
      throw new NotFoundException(`Pet owner by ${petId} not found`);
    }

    user.pets = user.pets.filter((pet) => pet.toString() !== petId);

    await this.usersService.updateUserById(user._id, user);

    return await this.petRepository.removeById(petId);
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

    const result = await this.lambdaService.sendImageToGoogleFunction(
      buffer,
      formatFileName,
      mimetype,
    );

    if (!result) return null;

    const imageResized = await this.imageResizeService.resizeImage(buffer);

    const imageBufferBase64 = imageResized.toString('base64');

    const url = result.location;

    await this.updateFieldImageInPet(url, petId, imageBufferBase64);

    return { url: url, image: imageBufferBase64 };
  }

  async saveImagePetDirectoryOnly(image: Express.Multer.File, petId: string) {
    const { buffer, originalname, mimetype } = image;

    const user = await this.usersService.findUserByPetId(petId);

    if (!user) {
      throw new NotFoundException(`User not found in pet`);
    }

    const formatFileName = `pets/${petId}/${originalname}`;

    const result = await this.lambdaService.sendImageToGoogleFunction(
      buffer,
      formatFileName,
      mimetype,
    );

    if (!result) return null;

    const url = result.location;

    const imageResized = await this.imageResizeService.resizeImage(buffer);

    const imageBufferBase64 = imageResized.toString('base64');

    return { url: url, image: imageBufferBase64 };
  }

  async getImagesFromPet(petId: string) {
    const imagesFromPet = await this.petRepository.getImagesFromPetById(petId);

    return { images: imagesFromPet };
  }
}
