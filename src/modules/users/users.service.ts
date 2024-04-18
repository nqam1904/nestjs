import { RedisCacheService } from '@common';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userEntity: Repository<User>,
    private redisCacheService: RedisCacheService,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  public async findAll() {
    try {
      const users = await this.userEntity.find();
      const data = users.map(({ password, ...rest }) => rest);
      if (!users.length) {
        return null;
      } else {
        return {
          data,
        };
      }
    } catch (error) {
      return new NotFoundException();
    }
  }

  public async findOne(id: number) {
    const user: any = await this.userEntity.findOne({ where: { id } });
    if (!user) throw new NotFoundException({ message: 'User not found!' });
    return user;
  }

  public async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userEntity.create(createUserDto);
      await this.userEntity.save(user);
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        { message: 'Can not create user!' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userEntity.update(id, updateUserDto);
  }

  public async delete(id: number) {
    try {
      const users = await this.userEntity.findOne({ where: { id } });
      if (!users) {
        throw new HttpException(
          { message: `Can not find user ${id}!` },
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.userEntity.delete(id);
      return {
        message: 'ok',
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
