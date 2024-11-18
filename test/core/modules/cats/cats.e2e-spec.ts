import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { ConfigService } from '@nestjs/config';
import { TestTypeOrmConfigService } from 'src/config/database.config';
import { DataSource } from 'typeorm';

describe('CatController (e2e)', () => {
  let app: INestApplication;

  const configService = new ConfigService();
  const typeOrmConfig = new TestTypeOrmConfigService(configService);

  const datasource = new DataSource(
    typeOrmConfig.createTypeOrmOptions() as any,
  );

  beforeAll(async () => {
    await datasource.initialize();
    await datasource.synchronize();
  });

  afterAll(async () => {
    await datasource.dropDatabase();
    await datasource.destroy();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(datasource)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/cats')
      .send({ name: 'cat', age: 1, breed: 'carei' })
      .expect(201)
      .expect({ data: { name: 'cat', age: 1, breed: 'carei', id: 1 } });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect({
        data: [{ name: 'cat', age: 1, breed: 'carei', id: 1 }],
        pagination: { total: 1 },
      });
  });

  it('/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/cats/1')
      .expect(200)
      .expect({
        data: { name: 'cat', age: 1, breed: 'carei', id: 1 },
      });
  });

  it('/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/cats/1')
      .send({ name: 'test' })
      .expect(200)
      .expect({
        data: { name: 'test', age: 1, breed: 'carei', id: 1 },
      });
  });

  it('/:id (DELETE)', () => {
    return request(app.getHttpServer()).delete('/cats/1').expect(204);
  });
});
