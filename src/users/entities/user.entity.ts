import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn, Unique } from "typeorm";

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
  password: string;

  @Column()
  salt: string;
}
