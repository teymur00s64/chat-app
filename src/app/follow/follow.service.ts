import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from 'src/database/entities/Follow.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateFollowDto } from './dto/create-follow.dto';
import { ClsService } from 'nestjs-cls';
import { User } from 'src/database/entities/User.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class FollowService {
  constructor(
    private cls: ClsService,
    private userService: UserService,
    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,
  ) {}

  async findOne(where: FindOptionsWhere<Follow>) {
    return this.followRepo.findOne({ where });
  }

  async create(params: CreateFollowDto) {
    let myUser = await this.cls.get<Promise<User>>('user');
    let user = await this.userService.findOne({ id: params.userId });

    let checkExists = await this.findOne({
      followerUser: { id: user.id },
      followedUser: { id: myUser.id },
    });

    if (checkExists)
      throw new ConflictException('you are already following this user');

    let follow = this.followRepo.create({
      followerUser: user,
      followedUser: myUser,
      isAccepted: user.isPrivate ? false : true,
    });

    await follow.save();

    return follow;
  }
}