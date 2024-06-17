import {
  IsNotEmpty,
  IsBoolean,
  IsDateString,
  MinLength,
} from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

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
