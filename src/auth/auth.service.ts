import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

// required functions for handling authentication for both web and mobile
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser({ email, password }: LoginDto) {
    const user = await this.userService.findByEmail(email);
    if (user && (await this.comparePassword(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async createTokens(
    user: Partial<User>,
    res?: Response,
    isWeb: boolean = false,
  ) {
    if (isWeb && !res) {
      throw new Error('Response object is required');
    }

    const payLoad = {
      userId: user.id,
      email: user.email,
      role: user.role,
      image: user.image,
      name: user.name,
    };
    const accessToken = this.jwtService.sign(
      { ...payLoad },
      {
        secret: this.configService.get('auth.secretKey'),
        expiresIn: 60 * 30, // 30 minutes
      },
    );

    const refreshToken = this.jwtService.sign(payLoad, {
      secret: this.configService.get('auth.refreshTokenSecret'),
      expiresIn: this.configService.get('auth.defaultExpirationTime'),
    });

    if (isWeb) {
      res.cookie('refreshToken', refreshToken, { httpOnly: true });
      res.cookie('accessToken', accessToken, { httpOnly: true });
    }

    return { accessToken, refreshToken };
  }

  async refreshCookieToken(
    refreshToken: string,
    req?: Request,
    res?: Response,
    isWeb: boolean = false,
  ) {
    if (isWeb && (!res || !req)) {
      throw new Error('Response and Request object is required');
    }
    if (!isWeb && !refreshToken) {
      throw new Error('Refresh token is required');
    }
    if (isWeb) {
      refreshToken = req.cookies['refreshToken'];
    }
    // const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refesh token');
    }

    const user = await this.userService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = this.jwtService.sign(
      {
        ...payload,
        // exp: Math.floor(Date.now() / 1000) + 1000 * 15,
      },
      {
        secret: this.configService.get('auth.refreshTokenSecret'),
        expiresIn: this.configService.get('auth.defaultExpirationTime'),
      },
    );

    if (isWeb) {
      res.cookie('acessToken', accessToken, { httpOnly: true });
      return res.send({ accessToken });
    }
    return this.createTokens(user);
  }

  async login(data: LoginDto, res?: Response, isWeb: boolean = false) {
    if (isWeb && !res) {
      throw new Error('Response object is required');
    }

    const user = await this.validateUser(data);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (isWeb) {
      return this.createTokens(user, res, isWeb);
    }
    return this.createTokens(user);
  }

  async register(data: RegisterDto, res?: Response, isWeb: boolean = false) {
    if (isWeb && !res) {
      throw new Error('Response object is required');
    }

    const hashedPassword = await this.hashPassword(data.password);

    // check if user exists
    const userExists = await this.userService.findByEmail(data.email);

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const user = await this.userService.create({
      ...data,
      password: hashedPassword,
    });

    if (isWeb) {
      return this.createTokens(user, res, isWeb);
    }
    return this.createTokens(user);
  }

  async logout(res: Response, isWeb) {
    if (!isWeb) {
      throw new Error('This method is only for web');
    }
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return true;
  }
}
