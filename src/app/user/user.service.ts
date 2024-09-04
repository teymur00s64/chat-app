import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/User.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

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
}
