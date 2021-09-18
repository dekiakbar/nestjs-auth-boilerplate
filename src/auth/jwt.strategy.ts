import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-jwt";
import { SignInDto } from "src/users/dto/sign-in.dto";
import { UserRepository } from "src/users/repository/user.repository";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("JWT_SECRET")
    })
  }

  async validate(signInDto: SignInDto): Promise<any> {
    const { username, email } = signInDto;
    const user = await this.userRepository.findOne({
      where: [
        { username: username },
        { email: email }
      ]
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    
    return user;
  }
  
}