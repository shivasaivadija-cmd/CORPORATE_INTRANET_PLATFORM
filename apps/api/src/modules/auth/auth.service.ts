import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '@database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email, tenantId: dto.tenantId },
    });
    if (existing) throw new ConflictException('Email already registered');

    const tenant = await this.prisma.tenant.findUnique({ where: { id: dto.tenantId } });
    if (!tenant) throw new BadRequestException('Invalid tenant');

    const hash = await bcrypt.hash(dto.password, this.config.get('auth.bcryptRounds', 12));
    const user = await this.prisma.user.create({
      data: {
        tenantId: dto.tenantId,
        email: dto.email,
        password: hash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        displayName: `${dto.firstName} ${dto.lastName}`,
        role: 'EMPLOYEE',
        status: 'ACTIVE',
      },
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    // Find tenant by ID or slug if provided, otherwise find by email domain
    let tenantId = dto.tenantId;
    
    if (dto.tenantId) {
      // Check if it's a slug
      const tenant = await this.prisma.tenant.findFirst({
        where: {
          OR: [
            { id: dto.tenantId },
            { slug: dto.tenantId },
          ],
        },
      });
      if (tenant) {
        tenantId = tenant.id;
      }
    }
    
    // If no tenant specified, find user by email only
    const user = await this.prisma.user.findFirst({
      where: tenantId 
        ? { email: dto.email, tenantId, status: 'ACTIVE' }
        : { email: dto.email, status: 'ACTIVE' },
      include: { department: true },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.generateTokens(user);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.refreshTokenHash) throw new UnauthorizedException('Access denied');

    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!valid) throw new UnauthorizedException('Access denied');

    return this.generateTokens(user);
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async validateUser(email: string, password: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { email, tenantId, status: 'ACTIVE' },
    });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  private async generateTokens(user: { id: string; tenantId: string; role: string; email: string }) {
    const payload = { sub: user.id, tenantId: user.tenantId, role: user.role, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('auth.jwtSecret'),
        expiresIn: this.config.get('auth.jwtExpiresIn', '15m'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('auth.refreshSecret'),
        expiresIn: this.config.get('auth.refreshExpiresIn', '7d'),
      }),
    ]);

    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: hash },
    });

    return { accessToken, refreshToken, userId: user.id };
  }
}
