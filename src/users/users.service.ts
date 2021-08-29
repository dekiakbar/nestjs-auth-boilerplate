import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UserRepository } from './repository/user.repository';

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
    const username = await this.userRepository.validatePassword(signInDto);
    if(!username){
      throw new UnauthorizedException("Invalid Credentials");
    }

    return username;
  }
}
