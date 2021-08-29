import { IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class SignInDto{
  @IsString()
  @IsNotEmpty()
  @ValidateIf(field => !field.email || field.username)
  username: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf(field => !field.username || field.email)
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}