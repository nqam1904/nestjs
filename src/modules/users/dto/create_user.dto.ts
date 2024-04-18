import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  // @IsPhoneNumber('VN')
  phone: string;

  // @IsNotEmpty()
  // @IsEnum(['ADMIN', 'MEMBER'], {
  //   message: 'Valid role required',
  // })
  // role: 'ADMIN' | 'MEMBER';
}
