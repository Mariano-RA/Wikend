import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AuthDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  verifySession(@Body() dto: AuthDto) {
    return this.authService.verifySession(dto);
  }
}
