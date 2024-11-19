import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmConfigService } from './config/database.config';
import { CatModule } from './core/modules/cats/cat.module';
import { LoggerMiddleware } from './core/commons/gateway/middlewares/logger.middleware';
import { AuthMiddleware } from './core/modules/auth/gateway/middleware/auth.middleware';
import { UserRepository } from './core/modules/auth/domain/repositories/user.repository';

import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './core/commons/gateway/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    CatModule,
  ],
  providers: [UserRepository, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
