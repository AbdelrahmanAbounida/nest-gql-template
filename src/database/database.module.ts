import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('database.host'),
        port: configService.getOrThrow('database.port'),
        database: configService.getOrThrow('database.name'),
        username: configService.getOrThrow('database.username'),
        password: configService.getOrThrow('database.password'),
        autoLoadEntities: true, // no need to add each entity we create here
        synchronize: configService.getOrThrow('database.synchronize'), // this gonna do migration automatically
        // entities: [User],
      }),
    }),
  ],
})
export class DatabaseModule {}
