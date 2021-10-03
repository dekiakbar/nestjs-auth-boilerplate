import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import 'moment-timezone';

@Injectable()
export class TimezoneService {
  constructor(
    private configService: ConfigService
  ){}

  async isExpired(
    date: Date
  ){
    const timezone = this.configService.get("APP_TIMEZONE");
    const configTime = this.configService.get("VERIFY_USER_LIFETIME");

    const createdAt = moment(date).tz(timezone).add(configTime, 'minutes');
    const now = moment().tz(timezone);

    if (now > createdAt) {
      return true;
    } else {
      return false;
    }
  }
}
