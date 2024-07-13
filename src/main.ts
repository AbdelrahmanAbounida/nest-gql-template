import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ValidationContext } from 'graphql';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],
  });
  const configService = app.get(ConfigService);

  // coockies
  app.use(cookieParser());

  // validation pip
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // if true this means that any extra propery will be removed automatically and got neglected
      transform: true,

      // instead of returning list of validation errors, it will throw an exception with one line error message
      // exceptionFactory: (errors) => {
      //   const formatedErrors = errors.reduce((acc, error) => {
      //     acc[error.property] = Object.values(error.constraints).join(', ');
      //     return acc;
      //   }, {});
      //   throw new BadRequestException({
      //     message: 'Validation failed',
      //     errors: formatedErrors,
      //   });
      // },
    }),
  );
  // class serializer interceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // app.useGlobalGuards; // instead of APP_GUARD in main module

  app.setGlobalPrefix('api');

  await app.listen(configService.getOrThrow('app.port'));
}
bootstrap();
