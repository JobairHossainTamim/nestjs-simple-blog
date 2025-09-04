import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole, Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDTO } from './dto/register.dto';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { EventService } from 'src/event/event.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
    private readonly userEventService: EventService,
  ) {}

  async register(registerDto: RegisterDTO) {
    const existUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existUser) {
      throw new ConflictException(
        'Email already exists please choose another one',
      );
    }

    const hashPassword = await this.hashPassword(registerDto.password);

    const newCreatedUser = this.usersRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashPassword,
      role: UserRole.USER,
    });

    const savedUser = await this.usersRepository.save(newCreatedUser);

    // user event
    this.userEventService.emitUserRegistered(savedUser);

    const { password, ...result } = savedUser;
    return {
      user: result,
      message: 'User registered successfully ',
    };
  }
  // created Admin
  async createAdmin(registerDto: RegisterDTO) {
    const existUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existUser) {
      throw new ConflictException(
        'Email already exists please choose another one',
      );
    }

    const hashPassword = await this.hashPassword(registerDto.password);

    const newCreatedUser = this.usersRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashPassword,
      role: UserRole.ADMIN,
    });

    const savedUser = await this.usersRepository.save(newCreatedUser);

    const { password, ...result } = savedUser;
    return {
      user: result,
      message: 'Admin registered successfully ',
    };
  }

  //   login

  async login(login: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: login.email },
    });

    if (!user || !(await this.verifyPassword(login.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    // generate jwt token
    const token = this.generateToken(user);
    const { password, ...result } = user;

    return {
      user: result,
      ...token,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: 'your-refresh-token-secret',
      });

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.generateAccessToken(user);

      return {
        accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  //   find current user id
  async getUserById(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private generateToken(user: Users) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  private generateAccessToken(user: Users): string {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      secret: 'your-access-token-secret',
      expiresIn: '365d',
    });
  }

  private generateRefreshToken(user: Users): string {
    const payload = {
      sub: user.id,
    };
    return this.jwtService.sign(payload, {
      secret: 'your-refresh-token-secret',
      expiresIn: '365d',
    });
  }
}
