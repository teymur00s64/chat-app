import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowEntity } from "src/database/entities/Follow.entity";
import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";

@Module({
    imports: [TypeOrmModule.forFeature([FollowEntity])],
    controllers: [FollowController],
    providers: [FollowService],
    exports: [FollowService],
  })

  export class FollowModule{}