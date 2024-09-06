import { Controller, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FollowService } from "./follow.service";

@Controller('follow')
@ApiTags('Follow')
@ApiBearerAuth()
export class FollowController {
    constructor(
        private followService: FollowService
    ){}

    @Post()
}