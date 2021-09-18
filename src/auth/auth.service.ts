import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from 'src/users/dto/sign-in.dto';
import { SignUpDto } from 'src/users/dto/sign-up.dto';
import { UserStatus } from 'src/users/enum/user-status.enum';
import { UserRepository } from 'src/users/repository/user.repository';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private usersService: UsersService
  ){}
  
  async signUp(signUpDto: SignUpDto): Promise<string>{
    return this.usersService.signUp(signUpDto);
  }

  async signIn(signInDto: SignInDto){
    const user = await this.userRepository.validatePassword(signInDto);
    if(!user){
      throw new UnauthorizedException("Invalid Credentials");
    }

    if(user.status != UserStatus.CONFIRMED){
      throw new ForbiddenException("The Account is not verified, please verify");
    }

    const payload: JwtPayload = { username: user.username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
