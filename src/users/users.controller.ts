import { Controller, Post, UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

@Controller('users')
export class UsersController {

  @UseGuards(AuthGuard())
  @Post('me')
  async me(
    @GetUser() user: User
  ){
    return user;
  }

}
