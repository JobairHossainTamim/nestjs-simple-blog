import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { RegisterDTO } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt.auth.guard';
import { CurrentUser } from './decorator/current-user.decorator';
import { Roles } from './decorator/role.decorator';
import { UserRole } from './entities/user.entity';
import { RolesGuard } from './guard/roles-guard';
import { LoginThrottlerGuard } from './guard/login.throttler.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerData: RegisterDTO) {
    return this.authService.register(registerData);
  }

  @UseGuards(LoginThrottlerGuard)
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  // protected routes
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return { user }; // ✅ only return role
  }

  // create admin routes
  @Post('create-admin')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createAdmin(@Body() registerData: RegisterDTO) {
    return this.authService.createAdmin(registerData);
  }
}
