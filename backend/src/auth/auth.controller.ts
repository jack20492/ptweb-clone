import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AuthCredentialsDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  register(@Body() dto: AuthCredentialsDto) {
    return this.authService.register(dto);
  }
}
