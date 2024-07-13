import { registerAs } from '@nestjs/config';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { validateConfig } from 'src/common/utils/validate-config';

interface AuthConfigProps {
  secretKey: string;
  defaultExpirationTime: number; // Eg: 60, "2 days", "10h", "7d"
}

class AuthConfigValidator {
  @IsString()
  secretKey: string;

  @IsNumber()
  @IsOptional()
  // @Transform(({ value }) => value ?? '2d')
  defaultExpirationTime: number;
}

export default registerAs<AuthConfigProps>('auth', () => {
  const config = {
    secretKey: process.env.AUTH_SECRET_KEY,
    defaultExpirationTime:
      parseInt(process.env.AUTH_DEFAULT_EXPIRATION_TIME) || 2 * 24 * 60 * 60, // 48 hours
  };

  validateConfig(config, AuthConfigValidator);
  return config;
});
