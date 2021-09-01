import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from './dto/send-email.dto';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService
  ){}
  
  async sendMail(
    SendEmailDto: SendEmailDto
  ): Promise<SMTPTransport.SentMessageInfo>{
    let testAccount = await nodemailer.createTestAccount();
    
    const host= this.configService.get('EMAIL_HOST') ? this.configService.get('EMAIL_HOST') : "smtp.ethereal.email";
    const port= this.configService.get('EMAIL_PORT') ? this.configService.get('EMAIL_PORT') : 587;
    const user= this.configService.get('EMAIL_USER') ? this.configService.get('EMAIL_USER') : testAccount.user;
    const pass= this.configService.get('EMAIL_PASS') ? this.configService.get('EMAIL_PASS') : testAccount.pass;
    
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: (parseInt(port) === 465) ? true : false ,
      auth: {
        user: user,
        pass: pass,
      },
    });

    const { from, to, subject, body } = SendEmailDto;
    
    try{
      let info = await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: body
      });
      
      return info;
    }catch(error){
      console.log(error);
    }

  }
}
