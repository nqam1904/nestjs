import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '@environment';
import { User } from '@modules/users';
import { UserDto } from '@modules/users/dto/user.dto';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Tokens } from '@types';
import { comparePassword } from '@utils';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userEntity: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  private async genrateToken(user: UserDto): Promise<Tokens> {
    const { password, ...rest } = user;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...rest },
        { secret: ACCESS_TOKEN_SECRET, expiresIn: 60 },
      ),
      this.jwtService.signAsync(
        { ...rest },
        { secret: REFRESH_TOKEN_SECRET, expiresIn: 60 * 60 * 24 },
      ),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async validateUser(payload: LoginDto) {
    const { username, password } = payload;

    const user = await this.userEntity.findOne({
      where: { username },
    });
    const isValid = await comparePassword(password, user.password);
    if (user && isValid) {
      const token = await this.genrateToken(user);
      const { password, ...rest } = user;
      return { ...rest, ...token };
    }
    throw new HttpException(
      'Email or password invalid',
      HttpStatus.UNAUTHORIZED,
    );
  }

  public async login(payload: LoginDto) {
    try {
      const data = await this.validateUser(payload);
      return {
        data,
      };
    } catch (error) {
      return error;
    }
  }

  public async registerUser(payload: RegisterDto) {
    try {
      const checkUser = await this.userEntity.findOne({
        where: { email: payload.email },
      });
      if (checkUser) {
        throw new HttpException(
          { message: 'This email has been used!' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.userEntity.create(payload);
      const { password, ...rest } = user;
      await this.userEntity.save(user);
      return {
        data: {
          ...rest,
        },
      };
    } catch (error) {
      return error;
    }
  }

  public async refreshToken(payload) {
    try {
      const { id } = payload['data'];
      const user = await this.userEntity.findOne({
        where: { id },
      });

      if (!user) throw new ForbiddenException('Access denied!');
      const token = await this.genrateToken(user);
      return token;
    } catch (error) {
      return error;
    }
  }
}
