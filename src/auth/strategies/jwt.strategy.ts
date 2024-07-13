import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'myjwt') {
  constructor(private configService: ConfigService) {
    super({
      usernameField: 'email',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.secretKey'),
    });
  }

  async validate(payload: any) {
    return payload;
  }

  private static extractJwtFromCookie(req: any) {
    if ('accessToken' in req && req.cookies) {
      return req.cookies.token;
    }
    return null;
  }
}
