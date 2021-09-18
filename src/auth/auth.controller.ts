import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { SignInDto } from 'src/users/dto/sign-in.dto';
import { SignUpDto } from 'src/users/dto/sign-up.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}

  @Post('signup')
  signUp(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<string> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  async signIn(@Body(ValidationPipe) SignInDto: SignInDto){
    return this.authService.signIn(SignInDto);
  }
}
