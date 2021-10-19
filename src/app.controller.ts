import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';

export class LoginDTO {
  @ApiProperty()
  id_token: string;
}

@ApiTags('auth')
@Controller('/api/auth')
export class AppController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginDTO })
  @Post('login')
  async login(@Body('id_token') id_token: string) {
    return this.authService.loginWithIdToken(id_token);
  }
}
