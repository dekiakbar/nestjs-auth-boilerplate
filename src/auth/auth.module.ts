import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/repository/user.repository';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenRepository } from 'src/users/repository/token.repository';
import { EmailModule } from 'src/email/email.module';
import { TimezoneModule } from 'src/timezone/timezone.module';

@Module({
  imports:[
    forwardRef(() => UsersModule),
    TimezoneModule,
    EmailModule,
    TypeOrmModule.forFeature([
      UserRepository,
      TokenRepository
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async(configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: configService.get("JWT_EXPIRES"), },
      }),
      inject:[ConfigService]
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports:[
    JwtStrategy,
    PassportModule
  ]
})
export class AuthModule {}
