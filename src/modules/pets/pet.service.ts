import { Injectable, NotFoundException } from '@nestjs/common';
import { Pet } from './pet.schema';
import { CreatePetDto } from './dto/pet.dto';
import { PetRepository } from './repositories/pet.repository';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class PetsService {
  constructor(
    private readonly petRepository: PetRepository,
    private readonly awsService: AwsService,
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

  private async updateFieldImageInPet(imageUrl: string, petId: string) {
    const pet = this.petRepository.updateImageAnimal(imageUrl, petId);
    if (!pet) throw new NotFoundException(`Pet ${petId} not found`);
    return pet;
  }

  async saveImagePet(
    image: Express.Multer.File,
    petId: string,
    userId: string,
  ) {
    const { buffer, originalname, mimetype } = image;

    const formatFileName = `users/${userId}/${petId}/${originalname}`;

    const result = await this.awsService.uploadFile(
      buffer,
      formatFileName,
      mimetype,
    );

    const url = result.Location;

    await this.updateFieldImageInPet(url, petId);

    return { url: url };
  }
}
