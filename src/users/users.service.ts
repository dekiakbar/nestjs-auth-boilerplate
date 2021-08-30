import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UserRepository } from './repository/user.repository';
import { UserStatus } from './enum/user-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ){}

  async signUp(signUpDto: SignUpDto){
    return this.userRepository.signUp(signUpDto);
  }

  async signIn(signInDto: SignInDto){
    const user = await this.userRepository.validatePassword(signInDto);
    if(!user){
      throw new UnauthorizedException("Invalid Credentials");
    }

    if(user.status != UserStatus.CONFIRMED){
      throw new ForbiddenException("The Account is not verified, please verify");
    }

    return user.username;
  }
}
