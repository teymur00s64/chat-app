import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/app/user/user.service";

export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>
    {

        const req = context.switchToHttp().getRequest();
        let token = req.headers.authorization || '';
        token = token.split(' ')[1];

        if(!token) throw new UnauthorizedException();

        try {
            
            let payload = this.jwtService.verify(token)
            if(!payload.userId) throw new Error();

            let user = await this.userService.findOne({id: payload.userId})
            if(!user) throw new UnauthorizedException();

            req.user = user    

        } catch (error) {
        
            throw new UnauthorizedException();

        }
   return true 
    }
}