import { ACCESS_TOKEN_SECRET } from '@environment';
import { User } from '@modules/users';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
