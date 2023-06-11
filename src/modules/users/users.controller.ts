import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller('apl-back-front/users')
export class UsersController {
  @Get()
  findAll(): string {
    return 'findAll';
  }

  @Get('/findById')
  findById(): string {
    return 'findByid';
  }

  @Post()
  create(): string {
    return 'create';
  }

  @Put()
  update(): string {
    return 'update';
  }

  @Delete()
  delete(): string {
    return 'delete';
  }
}
