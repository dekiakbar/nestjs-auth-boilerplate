import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TimezoneService } from './timezone.service';

@Module({
  imports:[
    ConfigModule
  ],
  providers: [TimezoneService],
  exports: [TimezoneService]
})
export class TimezoneModule {}
