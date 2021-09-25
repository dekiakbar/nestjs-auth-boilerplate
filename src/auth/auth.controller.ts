import { Body, Controller, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { SignInDto } from 'src/users/dto/sign-in.dto';
import { SignUpDto } from 'src/users/dto/sign-up.dto';
import { VerifyUserDto } from 'src/users/dto/verify-user.dto';
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

  @Get('verify/:token')
  async verifyUser(@Param('token') token: VerifyUserDto){
    return this.authService.verifyUser(token);
  }
}
