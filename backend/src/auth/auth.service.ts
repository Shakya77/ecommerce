import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: CreateAuthDto) {
    const check = await this.usersService.findOneEmail(user.email);

    if (!check) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(user.password, check.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (check.isActive === false) {
      throw new UnauthorizedException(
        'Account is inactive. Please contact admin.',
      );
    }

    const payload = {
      name: check.name,
      email: check.email,
      id: check.id,
      role: check.role,
      slug: check.slug,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
