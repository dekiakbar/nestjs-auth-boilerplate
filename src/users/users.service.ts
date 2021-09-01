import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UserRepository } from './repository/user.repository';
import { UserStatus } from './enum/user-status.enum';
import { EmailService } from 'src/email/email.service';
import { SendEmailDto } from 'src/email/dto/send-email.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private emailService: EmailService,
    private configService: ConfigService
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

    return user.username;
  }
}
