import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { UserStatus } from "../enum/user-status.enum";
import { Token } from "./token.entity";

@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  status: UserStatus;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(type => Token, token => token.user, { eager: true })
  tokens: Token[];

  async validateHash(password: string): Promise<boolean>{
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
