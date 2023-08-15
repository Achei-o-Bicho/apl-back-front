import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  public async login(@Res() res, @Body() login: LoginDto) {
    const { email, password } = login;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new NotFoundException();
    }

    const userLogged = await this.authService.login(user);

    res.status(HttpStatus.OK).json(userLogged);
  }
}
