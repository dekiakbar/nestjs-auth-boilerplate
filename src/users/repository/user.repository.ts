import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async signUp(
    createUserDto: CreateUserDto
  ): Promise<void>{
    const { username, email, password } = createUserDto;

    const user = new User();
    user.username = username;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try{
      await user.save();
    }catch(error){
      if( error.code === '23505'){
        throw new ConflictException('Username or email already exist');
      }else{
        throw new InternalServerErrorException();
      }
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string>{
    return bcrypt.hash(password, salt);
  }
} 