import { NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { QueryParserPipe } from './core/commons/gateway/pipes/qs-parser.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hz Group')
    .setDescription('The API for Hz Group')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  ); // add validation for dtos

  app.useGlobalPipes(new QueryParserPipe()); // extend depth default of qs for query params

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
