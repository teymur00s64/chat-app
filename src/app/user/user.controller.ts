import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGard } from 'src/guards/auth.guard';
import { AuthorizedRequest } from 'src/shared/interface/auth.interface';
import { User } from 'src/database/entities/User.entity';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(
    private userService: UserService
    private cls: 
  ) {}

  @Get('/profile')
  @UseGuards(AuthGard)
  myProfile() {
    let user = this.cls.get<User> = 
    return this.userService.findOne({ id: req.user.id });
  }

  @Get('/profile/:id')
  @UseGuards(AuthGard)
  async userProfile(@Param('id') id: number) {

  }

  //@Get('search')

}
