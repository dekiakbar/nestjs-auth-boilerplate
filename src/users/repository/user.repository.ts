import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(
    createUserDto: CreateUserDto
  ): Promise<void>{
    const { username, email, password } = createUserDto;

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;
    try{
      await user.save();
    }catch(error){
      if( error.code === '23505'){
        // duplicate username
        throw new ConflictException('Username already exist');
      }else{
        throw new InternalServerErrorException();
      }
    }
  }
} 