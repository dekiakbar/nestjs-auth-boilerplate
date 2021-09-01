import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserRepository]),
    EmailModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
