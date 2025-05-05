import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class RegisterUserDto {
  @IsNotEmpty()
  fullName: string

  @IsEmail()
  email: string

  @MinLength(6)
  password: string
}
