import {
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsBoolean()
  isVerify: boolean;

  @IsBoolean()
  isAdmin: boolean;
}
