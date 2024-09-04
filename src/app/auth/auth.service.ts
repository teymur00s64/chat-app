import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRole } from 'src/shared/enum/user.enum';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async logIn(params: LoginUserDto) {
    let user = await this.userService.findOne([
      { userName: params.userName },
      { email: params.userName },
    ]);

    if (!user)
      throw new HttpException(
        'login or password is wrong',
        HttpStatus.BAD_REQUEST,
      );

    let checkPassword = await bcrypt.compare(params.password, user.password);
    if (!checkPassword)
      throw new HttpException(
        'login or password is wrong',
        HttpStatus.BAD_REQUEST,
      );

    let payload = {
      userId: user.id,
    };

    let token = this.jwtService.sign(payload);
    return {
      token,
      user,
    };
  }

  async register(params: RegisterUserDto) {
    return await this.userService.create({ ...params, roles: [UserRole.USER] });
  }
}
