import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Cat } from 'src/core/modules/cats/domain/entities/cat.entity';
import { Tag } from 'src/core/modules/cats/domain/entities/tag.entity';
import { TagName } from 'src/core/modules/cats/domain/entities/tag-name.entity';

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
      entities: [Cat, Tag, TagName], // TODO: config entitis generic
      synchronize: !this.configService.get<boolean>('PRODUCTION'),
      logging: ['query'],
    };
  }
}
