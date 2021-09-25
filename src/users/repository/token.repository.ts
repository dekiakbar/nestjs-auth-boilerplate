import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { VerifyUserDto } from "../dto/verify-user.dto";
import { Token } from "../entities/token.entity";
import { User } from "../entities/user.entity";
import { TokenType } from "../enum/token-type.enum";
import { UserStatus } from "../enum/user-status.enum";

@EntityRepository(Token)
export class TokenRepository extends Repository<Token>{
  async verifyUser(
    verifyUserDto: VerifyUserDto
  ):Promise <User>{
    
    const token = await this.findOne({
      relations: ['user'],
      where: [
        {
          token : verifyUserDto,
          type: TokenType.EMAIL_VERIICATION
        }
      ]
    });

    if(!token){
      throw new NotFoundException("Token is missmatch or invalid");
    }
    
    // if(token.user.status === UserStatus.CONFIRMED){
    //   throw new BadRequestException("User already verified");
    // }
    const user = await this.setUserAsVerified(token);
    return user;
  }

  async setUserAsVerified(
    token: Token
  ):Promise <User>{
    try{
      const user = token.user;
      user.status = UserStatus.CONFIRMED;
      await user.save();
      const data = await this.delete(token.id);

      return user;
    }catch(error){
      throw new InternalServerErrorException();
    }
  }
}