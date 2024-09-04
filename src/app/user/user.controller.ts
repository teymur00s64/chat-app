import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { AuthGuard } from "src/guards/auth.guard";
import { AuthorizedRequest } from "src/shared/interface/auth.interface";

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
        constructor(
            private userService: UserService
        ){}

    @Get('/profile')
    @UseGuards(AuthGuard)
    myProfile(@Req() req: AuthorizedRequest){
        return this.userService.findOne({id: req.user.id})
    }
}