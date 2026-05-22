import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '@common/decorators/auth.decorator';
import { CurrentUser } from '@common/decorators/user.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.register(dto);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { data: { accessToken: tokens.accessToken, userId: tokens.userId } };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { data: { accessToken: tokens.accessToken, userId: tokens.userId } };
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as any;
    const tokens = await this.authService.refreshTokens(user.sub, user.refreshToken);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { data: { accessToken: tokens.accessToken } };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('id') userId: string, @Res({ passthrough: true }) res: Response) {
    if (!userId) {
      res.clearCookie('refresh_token');
      return { data: { message: 'Logged out successfully' } };
    }
    try {
      await this.authService.logout(userId);
    } catch (error) {
      console.error('Logout error:', error);
    }
    res.clearCookie('refresh_token');
    return { data: { message: 'Logged out successfully' } };
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api',
    });
  }
}
