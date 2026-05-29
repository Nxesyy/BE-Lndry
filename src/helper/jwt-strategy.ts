import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config"


type payload = {
    id: number
    email: string
    role: string
}

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
     constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'secret-word',
        });
    }

    async validate(Payload: payload) {
        return Payload
    }
}