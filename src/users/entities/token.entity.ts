import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { TokenType } from "../enum/token-type.enum";
import { User } from "./user.entity";

@Entity()
export class Token extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string

  @Column()
  type: TokenType;
  
  @ManyToOne(type => User, user => user.tokens, { eager: false })
  user: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;
}