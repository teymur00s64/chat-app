import { BadRequestException, ConflictException, forwardRef, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from 'src/database/entities/Follow.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateFollowDto } from './dto/create-follow.dto';
import { ClsService } from 'nestjs-cls';
import { User } from 'src/database/entities/User.entity';
import { UserService } from '../user/user.service';
import { FollowStatus } from 'src/shared/enum/follow.enum';
import { FOLLOW_REQUEST_LIST_SELECT } from './follow.select';
import { FindParams } from 'src/shared/types/find.params';

@Injectable()
export class FollowService {
  constructor(
    private cls: ClsService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @InjectRepository(Follow)
    private followRepo: Repository<Follow>,
  ) {}

  async find(params: FindParams<Follow>) {
    const { where, select, relations } = params;
    return this.followRepo.find({ where, select, relations });
  }

  async findOne(params: Omit<FindParams<Follow>, 'limit' | 'page'>) {
    const { where, select, relations } = params;
    return this.followRepo.findOne({ where, select, relations });
  }

  async create(params: CreateFollowDto) {
    let myUser = await this.cls.get<Promise<User>>('user');
    let user = await this.userService.findOne({ where: { id: params.userId } })

    let checkExists = await this.findOne({
      where: {
        follower: { id: user.id },
        followed: { id: myUser.id },
      },
    });

    if (checkExists)
      throw new ConflictException('you are already following this user');

    let follow = this.followRepo.create({
      follower: { id: user.id },
      followed: { id: myUser.id },
      status: user.isPrivate ? FollowStatus.WAITING : FollowStatus.FOLLOWING,
    });

    if (!user.isPrivate) {
      user.followerCount++;
      myUser.followedCount++;

      await Promise.all([user.save(), myUser.save()]);
    }

    await follow.save();

    return follow;
  }

  async removeFollow(userId: number) {
    let myUser = await this.cls.get<User>('user');
    let user = await this.userService.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException();

    let follow = await this.findOne({
      where: {
        followed: { id: user.id },
        follower: { id: myUser.id },
      },
    });

    if (!follow) throw new NotFoundException('Follow is not found');

    if (follow.status === FollowStatus.FOLLOWING) {
      myUser.followerCount--;
      user.followedCount--;
      await Promise.all([myUser.save(), user.save()]);
    }

    await follow.remove();
  }

  async unfollow(userId: number) {
    let myUser = await this.cls.get<User>('user');
    let user = await this.userService.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException();

    let follow = await this.findOne({
      where: {
        followed: { id: myUser.id },
        follower: { id: user.id },
      },
    });

    if (!follow) throw new NotFoundException('Follow is not found');

    if (follow.status === FollowStatus.FOLLOWING) {
      user.followerCount--;
      myUser.followedCount--;
      await Promise.all([myUser.save(), user.save()]);
    }

    await follow.remove();
  }

  async accept(userId: number) {
    let myUser = await this.cls.get<User>('user');
    let user = await this.userService.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException();

    let follow = await this.findOne({
      where: {
        followed: { id: user.id },
        follower: { id: myUser.id },
      },
    });

    if (!follow) throw new NotFoundException('Follow requeset is not found');

    if (follow.status != FollowStatus.WAITING)
      throw new BadRequestException('You have already accepted this request');

    follow.status = FollowStatus.FOLLOWING;

    myUser.followerCount++;
    user.followedCount++;

    await Promise.all([follow.save(), myUser.save(), user.save()]);

    return {
      status: true,
      message: "You've accepted follow request",
    };
  }

  async reject(userId: number) {
    let myUser = await this.cls.get<User>('user');
    let user = await this.userService.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException();

    let follow = await this.findOne({
      where: {
        followed: { id: user.id },
        follower: { id: myUser.id },
      },
    });

    if (!follow) throw new NotFoundException('Follow requeset is not found');

    if (follow.status != FollowStatus.WAITING) throw new BadRequestException();

    await follow.remove();

    return {
      status: true,
      message: "You've rejected follow request",
    };
  }

  async followRequests() {
    let myUser = await this.cls.get<User>('user');

    return this.find({
      where: {
        follower: { id: myUser.id },
        status: FollowStatus.WAITING,
      },
      relations: ['followed'],
      select: FOLLOW_REQUEST_LIST_SELECT,
    });
  }

  async acceptAllRequsts(userId: number) {
    return await this.followRepo.update(
      {
        status: FollowStatus.WAITING,
        follower: {
          id: userId,
        },
      },
      { status: FollowStatus.FOLLOWING },
    );
  }
  
}