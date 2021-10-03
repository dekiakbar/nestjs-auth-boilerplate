import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { TimezoneModule } from './timezone/timezone.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.example'],
      isGlobal: true
    }),
    UsersModule,
    DatabaseModule,
    EmailModule,
    AuthModule,
    TimezoneModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
