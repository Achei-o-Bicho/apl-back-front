import { Injectable } from '@nestjs/common';
import { CreatePetDto } from '../dto/pet.dto';
import { Pet } from '../pet.schema';
import { PetRepository } from './pet.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/modules/users/users.service';

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
  async findAllById(petId: string): Promise<Pet> {
    return this.petModel.findById(petId);
  }
  async removeById(petId: string): Promise<void> {
    await this.petModel.findByIdAndRemove(petId);
  }

  async updateImageAnimal(
    imageUrl: string,
    petId: string,
  ): Promise<Pet | null> {
    const filter = { _id: petId };
    const update = { $set: { image: imageUrl } };

    const updatedPet = await this.petModel.findOneAndUpdate(filter, update, {
      new: true,
    });

    return updatedPet;
  }
}
