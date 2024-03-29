import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('login')
  public async login(@Res() res, @Body() login: LoginDto) {
    const { email, password } = login;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('User or password is invalid.');
    }

    const userLogged = await this.authService.login(user);

    res.status(HttpStatus.OK).json({ data: userLogged });
  }
}
