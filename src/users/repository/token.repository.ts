import { InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Token } from "../entities/token.entity";
import { User } from "../entities/user.entity";
import { UserStatus } from "../enum/user-status.enum";

@EntityRepository(Token)
export class TokenRepository extends Repository<Token>{
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