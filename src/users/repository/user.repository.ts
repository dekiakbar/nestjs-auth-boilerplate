import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { SignUpDto } from "../dto/sign-up.dto";
import { User } from "../entities/user.entity";
import * as bcrypt from 'bcrypt';
import { SignInDto } from "../dto/sign-in.dto";
import { UserStatus } from "../enum/user-status.enum";
import * as crypto from 'crypto';
import { Token } from "../entities/token.entity";
import { TokenType } from "../enum/token-type.enum";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(
    signUpDto: SignUpDto
  ): Promise<User>{
    const { username, email, password } = signUpDto;

    const user = new User();
    user.username = username;
    user.email = email;
    user.status = UserStatus.UNCONFIRMED;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    const token = new Token();
    token.type = TokenType.EMAIL_VERIICATION;
    token.token = crypto.randomBytes(32).toString('hex');
    // token.created_at = new Date();

    try{
      const userData = await user.save();
      token.user = userData;
      token.save();

      return userData;
    }catch(error){
      if( error.code === '23505'){
        throw new ConflictException('Username or email already exist');
      }else{
        throw new InternalServerErrorException();
      }
    }
  }

  async validatePassword(
    signInDto: SignInDto
  ): Promise<User>{
    const { username, email, password } = signInDto;
    const user = await this.findOne({
      where: [
        { username: username },
        { email: email }
      ]
    });
    
    if(user && await user.validateHash(password)){
      return user;
    }else{
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string>{
    return bcrypt.hash(password, salt);
  }
} 