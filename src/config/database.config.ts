import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { validateConfig } from 'src/common/utils/validate-config';

interface DatabaseConfigProps {
  type?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  autoLoadEntities?: boolean;
  synchronize?: boolean;
}

class DatabaseConfigValidator {
  @IsString()
  MYSQL_ROOT_PASSWORD: string;

  @IsString()
  MYSQL_DATABASE: string;

  @IsString()
  MYSQL_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  MYSQL_PORT: number;

  @IsString()
  MYSQL_USERNAME: string;

  @IsBoolean()
  @IsOptional()
  MYSQL_SYNCHRONIZE: boolean;
}

// main config function
export default registerAs<DatabaseConfigProps>('database', () => {
  validateConfig(process.env, DatabaseConfigValidator);

  return {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
    password: process.env.MYSQL_ROOT_PASSWORD,
    name: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USERNAME,
    synchronize: process.env.MYSQL_SYNCHRONIZE === 'true',
  };
});
