import { Controller, Get, NotFoundException, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGard } from 'src/guards/auth.guard';
import { User } from 'src/database/entities/User.entity';
import { SearchUserDto } from './dto/search-user.dto';
import { ClsService } from 'nestjs-cls';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(
    private userService: UserService,
    private cls: ClsService
  ) {}

  @Get('profile')
  @UseGuards(AuthGard)
  myProfile() {
    let user = this.cls.get<User>('user');
    return this.userService.findOne({ id: user.id });
  }

  @Get('profile/:id')
  @UseGuards(AuthGard)
  async userProfile(@Param('id') id: number) {
    let user = await this.userService.findOne({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  @Get('search')
  @UseGuards(AuthGard)
  search(@Query() query: SearchUserDto) {
    return this.userService.search(query);

}
}
