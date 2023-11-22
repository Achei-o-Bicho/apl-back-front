import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePetDto } from '../dto/create-pet.dto';
import { Pet } from '../pet.schema';
import { PetRepository } from './pet.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/modules/users/users.service';
import { PetDto } from '../dto/pet.dto';

@Injectable()
export class PetRepositoryService implements PetRepository {
  constructor(
    @InjectModel(Pet.name) private petModel: Model<Pet>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPet: CreatePetDto): Promise<Pet> {
    const dateBirthday = new Date(createPet.birthday);
    const createdPet = new this.petModel(createPet, {
      birthday: dateBirthday,
    });
    const pet = await createdPet.save();
    await this.usersService.addPetToUser(pet, createPet.userId);
    return pet;
  }
  async findAll(): Promise<Pet[]> {
    return this.petModel.find().exec();
  }
  async findAllById(petId: string): Promise<PetDto> {
    return this.petModel.findById(petId);
  }

  async findAllByIdPet(petId: string): Promise<Pet> {
    return await this.petModel.findOne({ petId: petId });
  }

  removeById(petId: string): Promise<Pet> {
    return this.petModel.findByIdAndRemove(petId);
  }

  async updateImageAnimal(
    imageUrl: string,
    petId: string,
    base64: string,
  ): Promise<Pet | null> {
    const filter = { _id: petId };
    const update = {
      $push: { images: { location: imageUrl, base64: base64 } },
    };

    const updatedPet = await this.petModel.findOneAndUpdate(filter, update, {
      new: true,
    });

    return updatedPet;
  }

  async getImagesFromPetById(
    petId: string,
  ): Promise<{ location: string; image: string }[]> {
    const pet = await this.petModel.findById(petId).exec();

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    const images = pet.images.map((image) => ({
      location: image.location,
      image: image.base64,
    }));

    return images;
  }
}
