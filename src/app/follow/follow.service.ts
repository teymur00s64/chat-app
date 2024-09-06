import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FollowEntity } from "src/database/entities/Follow.entity";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowEntity)
    private followRepo: Repository<FollowEntity>,
  ) {}

  findOne(where: FindOptionsWhere<FollowEntity> | FindOptionsWhere<FollowEntity>[]) {
    return this.followRepo.findOne({})
  }

  async create(params: Partial<CreateFollowDto>) {
    
  }
}