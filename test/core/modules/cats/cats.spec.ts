import { ConfigService } from '@nestjs/config';
import {
  TestTypeOrmConfigService,
  TypeOrmConfigService,
} from 'src/config/database.config';
import { CreateCatDto } from 'src/core/modules/cats/domain/dtos/cat-create.dto';
import { Cat } from 'src/core/modules/cats/domain/entities/cat.entity';
import { CatRepository } from 'src/core/modules/cats/domain/repositories/cat.repository';
import {
  CreateCatUseCase,
  DeleteCatUseCase,
  GetAllCatsUseCase,
  GetOneCatUseCase,
  UpdateCatUseCase,
} from 'src/core/modules/cats/domain/usecases/crud-cat.usecase';
import { CatController } from 'src/core/modules/cats/gateway/controllers/cat.controller';
import { DataSource } from 'typeorm';

describe('Cat use cases', () => {
  const configService = new ConfigService();
  const typeOrmConfig = new TestTypeOrmConfigService(configService);

  const datasource = new DataSource(
    typeOrmConfig.createTypeOrmOptions() as any,
  );

  let catRepository: CatRepository;
  let createUseCase: CreateCatUseCase;
  let getOneUseCase: GetOneCatUseCase;
  let getAllUseCase: GetAllCatsUseCase;
  let deleteUseCase: DeleteCatUseCase;
  let updateUseCase: UpdateCatUseCase;

  const catsDtos: CreateCatDto[] = [
    {
      name: 'cat 1',
      age: 1,
      breed: 'carei',
    },
    {
      name: 'cat 2',
      age: 2,
      breed: 'carei',
    },
    {
      name: 'cat 3',
      age: 3,
      breed: 'carei',
    },
  ];

  const cats: Partial<Cat>[] = [
    {
      id: 1,
      name: 'cat 1',
      age: 1,
      breed: 'carei',
    },
    {
      id: 2,
      name: 'cat 2',
      age: 2,
      breed: 'carei',
    },
    {
      id: 3,
      name: 'cat 3',
      age: 3,
      breed: 'carei',
    },
  ];

  beforeAll(async () => {
    await datasource.initialize();
    await datasource.synchronize();

    catRepository = new CatRepository(datasource);
    createUseCase = new CreateCatUseCase(catRepository);
    getOneUseCase = new GetOneCatUseCase(catRepository);
    getAllUseCase = new GetAllCatsUseCase(catRepository);
    deleteUseCase = new DeleteCatUseCase(catRepository);
    updateUseCase = new UpdateCatUseCase(catRepository);

    await Promise.all(
      catsDtos.map(async (catDto) => {
        await catRepository.create(catDto as Cat);
      }),
    );
  });

  afterAll(async () => {
    await datasource.dropDatabase();
    await datasource.destroy();
  });

  it('Get all cats', async () => {
    const [res, count] = await getAllUseCase.execute({
      filters: {},
      sort: { id: 'ASC' },
    });

    expect(count).toEqual(3);
    expect(res).toEqual(cats);
  });

  it('Get one cat', async () => {
    const res = await getOneUseCase.execute(1);
    const resnull = await getOneUseCase.execute(5);

    expect(res).toEqual(cats[0]);
    expect(resnull).toEqual(null);
  });

  it('Create cat', async () => {
    const cat = { name: 'cat 4', age: 4, breed: 'carei' };
    const res = await createUseCase.execute(cat as Cat);

    expect(res).toEqual(cat);
    expect(res.id).toEqual(4);
  });

  it('Update cat', async () => {
    const cat = { name: 'cat 4 edited' };
    const res = await updateUseCase.execute(4, cat as Cat);

    expect(res?.name).toEqual('cat 4 edited');
  });

  it('Delete cat', async () => {
    await deleteUseCase.execute(4);

    const resnull = await getOneUseCase.execute(4);
    expect(resnull).toEqual(null);
  });
});
