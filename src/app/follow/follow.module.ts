import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowEntity } from "src/database/entities/Follow.entity";
import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([FollowEntity]), UserModule],
    controllers: [FollowController],
    providers: [FollowService],
    exports: [FollowService],
  })

  export class FollowModule{}