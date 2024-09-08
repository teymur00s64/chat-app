import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/User.entity';
import { DeepPartial, FindManyOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { FindUserParams } from './user.types';
import { SEARCH_USER_SELECT } from './user.select';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class UserService {
  constructor(
    private cls: ClsService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  find(params: FindUserParams){
    const {where, select, relations, limit, page} = params;
    const payload:FindManyOptions<User> = {where, select, relations}

    if(limit>0) {
      payload.take = limit;
      payload.skip = limit* page
    }
    return this.userRepo.find(payload)
  }

  findOne(where: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    return this.userRepo.findOne({ where });
  }

  async create(params: Partial<CreateUserDto>) {
    let checkUserName = await this.findOne({ userName: params.userName });
    if (checkUserName)
      throw new ConflictException('This username is already exists');

    let checkUserEmail = await this.findOne({ email: params.email });
    if (checkUserEmail)
      throw new ConflictException('This email is already exists');

    let user = this.userRepo.create(params);

    await user.save();

    return user;
  }

  async update(id: number, params: Partial<User>) {
    await this.userRepo.update({ id }, params);
  }

  async search(params: SearchUserDto) {
    const { searchParam, page = 0, limit = 10 } = params;

    const myUser = await this.cls.get<User>('user');
    
    let where:FindOptionsWhere<User>[] = [ 
      {
        userName: ILike(`${searchParam}%`),
      }
      ,
      {
        email: searchParam,
      },
      {
        firstName: ILike(`${searchParam}%`),
      },
      {
        lastName: ILike(`${searchParam}%`),
      },
    ];

    const relations = ['followers', 'followers.followedUser'];

    let users = await this.find({
      where,
      select: SEARCH_USER_SELECT,
      page,
      limit,
      relations,
    });

    let mappedUsers = users.map((user) => {
      let isFollowing =
        user.followers.find(
          (follow) => follow.followedUser.id === myUser.id,
        ) !== undefined;
      return {
        ...user,
        isFollowing,
        followers: undefined,
      };
    });

    return mappedUsers;
  }
}
