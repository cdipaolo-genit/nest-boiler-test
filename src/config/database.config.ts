import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Cat } from 'src/core/modules/cats/domain/entities/cat.entity';
import { Tag } from 'src/core/modules/cats/domain/entities/tag.entity';
import { TagName } from 'src/core/modules/cats/domain/entities/tag-name.entity';
import { User } from 'src/core/modules/auth/domain/entities/user.entity';
import { Role } from 'src/core/modules/auth/domain/entities/role.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: [Cat, Tag, TagName, User, Role], // TODO: config entitis generic
      synchronize: !this.configService.get<boolean>('PRODUCTION'),
      // logging: ['query'],
    };
  }
}

@Injectable()
export class TestTypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: 'test',
      entities: [Cat, Tag, TagName],
      synchronize: true,
    };
  }
}
