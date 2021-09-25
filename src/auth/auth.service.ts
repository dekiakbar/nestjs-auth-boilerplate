import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SendEmailDto } from 'src/email/dto/send-email.dto';
import { EmailService } from 'src/email/email.service';
import { SignInDto } from 'src/users/dto/sign-in.dto';
import { SignUpDto } from 'src/users/dto/sign-up.dto';
import { VerifyUserDto } from 'src/users/dto/verify-user.dto';
import { UserStatus } from 'src/users/enum/user-status.enum';
import { TokenRepository } from 'src/users/repository/token.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(TokenRepository)
    private tokenRepository: TokenRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService
  ){}
  
  async signUp(signUpDto: SignUpDto): Promise<string>{
    const user = await this.userRepository.signUp(signUpDto);
    if(user){
      
      const emailData = new SendEmailDto();
      emailData.from = this.configService.get('EMAIL_FROM_NAME')+' <'+this.configService.get('EMAIL_FROM')+'>';
      emailData.to = user.email;
      emailData.subject = 'Welcome';
      emailData.body = "Please click this button to confirm email";

      await this.emailService.sendMail(emailData);

      return user.email;
    }
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

  async verifyUser(
    verifyUserDto: VerifyUserDto
  ){
    const user = await this.tokenRepository.verifyUser(verifyUserDto);
    const payload: JwtPayload = { username: user.username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
