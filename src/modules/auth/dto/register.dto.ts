import { BaseResponse } from '@common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email invalidate' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;
}
export class RegisterReponse extends BaseResponse<RegisterDto> {}
