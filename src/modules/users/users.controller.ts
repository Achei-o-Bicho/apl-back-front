import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Res,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Res() response, @Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'User has been created successfully',
        newUser,
      });
    } catch (err) {
      return response.status(err.status).json({
        message: 'Error user not created',
        error: err.response,
      });
    }
  }

  @Get()
  async findAll(@Res() response) {
    try {
      const userData = await this.usersService.findAll();
      return response.status(HttpStatus.OK).json({
        message: 'All users data found successfully',
        userData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async findById(@Res() response, @Param('id') userId: string) {
    try {
      const existingUser = await this.usersService.findById(userId);
      return response.status(HttpStatus.OK).json({
        message: 'User found successfully',
        existingUser,
      });
    } catch (err) {
      return response.status(err.status).json({
        message: 'User not found',
        err: err.response,
      });
    }
  }

  @Put('/:id')
  async update(
    @Res() response,
    @Param('id') userId: string,
    @Body() updatedUserDto: CreateUserDto,
  ) {
    try {
      const existingUser = this.usersService.updateUserById(
        userId,
        updatedUserDto,
      );
      return response.status(HttpStatus.OK).json({
        message: 'User has been successfully updated',
        updatedUserDto,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async delete(@Res() response, @Param('id') userId: string) {
    try {
      const deletedUser = await this.usersService.deleteUserById(userId);
      return response.status(HttpStatus.OK).json({
        message: 'User deleted successfully',
        deletedUser,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
