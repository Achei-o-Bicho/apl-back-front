import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { IUser } from '../users/interface/user.interface';
import { maskedUser } from 'src/utils/mask.utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    emailAddress: string,
    password: string,
  ): Promise<IUser | null> {
    try {
      const user = await this.userService.findByEmailAddress(emailAddress);

      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }

      return null;
    } catch (err) {
      this.logger.error(err);
    }
  }

  async login(user: IUser) {
    try {
      const payload = maskedUser(user);
      return {
        accessToken: this.jwtService.sign(payload),
        userId: user._id,
      };
    } catch (err) {
      this.logger.error(err);
    }
  }
}
