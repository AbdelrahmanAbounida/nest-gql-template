import { registerAs } from '@nestjs/config';
import { IsEAN, IsEmail, IsString } from 'class-validator';
import { validateConfig } from 'src/common/utils/validate-config';

interface ResendConfigProps {
  api_key: string;
  from: string;
}

class ResendConfigValidator {
  @IsString()
  api_key: string;

  @IsEmail()
  from: string;
}

export default registerAs<ResendConfigProps>('resend', () => {
  const config = {
    api_key: process.env.RESEND_API_KEY,
    from: process.env.RESEND_FROM,
  };

  validateConfig(config, ResendConfigValidator);

  return config;
});
