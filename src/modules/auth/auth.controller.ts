import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenGuard } from './guard/refresh.guard';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authSerive: AuthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login success!',
    type: LoginDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Login failed!',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  public async login(@Body(ValidationPipe) payload: LoginDto) {
    return this.authSerive.login(payload);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Register success!',
    type: '',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Register failed!',
  })
  @Post('/register')
  public async register(@Body(ValidationPipe) payload: RegisterDto) {
    return this.authSerive.registerUser(payload);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh token success!',
    type: '',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Refresh token failed!',
  })
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refreshToken')
  public async refreshToken(@Req() req: Request) {
    // @ts-ignore
    const user = req.user;
    return await this.authSerive.refreshToken(user);
  }
}
