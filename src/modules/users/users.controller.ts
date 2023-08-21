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
  Logger,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IUser } from './interface/user.interface';
import { DeleteUserResponseDto } from './dto/deleted-user.dto';
import { UserCreatedDto } from './dto/user-created.dto';
import { SendWhatsappService } from '../send-message/send-whatsapp.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Users')
@Controller('/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been created successfully',
    type: UserCreatedDto,
  })
  @Post()
  async create(@Res() response, @Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);

      if (!newUser) {
        const message = 'User already exists';
        this.logger.debug(message);
        return response.status(412).json({
          message: message,
        });
      }

      return response.status(HttpStatus.CREATED).json({
        message: 'User has been created successfully',
        newUser,
      });
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All users data found succesfully',
    type: Array<IUser>,
  })
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

  @UseGuards(AuthGuard)
  @Get('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found successfully',
    type: IUser,
  })
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Delete('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
    type: DeleteUserResponseDto,
  })
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

  @UseGuards(AuthGuard)
  @Post('validate-number')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ValidateNumber',
  })
  async validateNumberUser(
    @Res() response,
    @Body() validateNumberDto: { number: string },
  ) {
    const validateNumber = await this.usersService.validateNumberUser(
      validateNumberDto.number,
    );

    response.status(HttpStatus.OK).json({
      tokenOtp: validateNumber,
    });
  }

  @UseGuards(AuthGuard)
  @Get('pets/:idUser')
  async getPetsOfUser(@Res() res, @Param('idUser') user: string) {
    const pets = await this.usersService.getPetsOfUser(user);

    res.status(HttpStatus.OK).json(pets);
  }
}
