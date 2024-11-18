import {
  QueryBuilder,
  QueryBuilderDirector,
} from 'src/core/commons/domain/services/query-builder.service';
import { Cat } from 'src/core/modules/cats/domain/entities/cat.entity';
import { TypeOrmConfigService } from 'src/config/database.config';

import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

describe('Query builder for Cat entity', () => {
  const configService = new ConfigService();
  const typeOrmConfig = new TypeOrmConfigService(configService);

  const datasource = new DataSource(
    typeOrmConfig.createTypeOrmOptions() as any,
  );
  let qb: any;
  let director: any;

  beforeAll(async () => {
    await datasource.initialize();
    qb = new QueryBuilder(datasource.getRepository(Cat), 'cats');
    director = new QueryBuilderDirector(qb, 'cats');
  });

  beforeEach(() => {
    qb.reset();
  });

  it('Query with sort', async () => {
    director.addSort({ id: 'ASC' });

    const sql = await qb.debugQuery();

    const expectedQuery = `SELECT "cats"."id" AS "cats_id", "cats"."name" AS "cats_name", "cats"."age" AS "cats_age", "cats"."breed" AS "cats_breed" FROM "cat" "cats" ORDER BY "cats"."id" ASC`;

    expect(sql).toBe(expectedQuery);
  });

  it('Query with pagination', async () => {
    director.addPagination(5, 5);

    const sql = await qb.debugQuery();

    const expectedQuery = `SELECT "cats"."id" AS "cats_id", "cats"."name" AS "cats_name", "cats"."age" AS "cats_age", "cats"."breed" AS "cats_breed" FROM "cat" "cats" LIMIT 5 OFFSET 5`;

    expect(sql).toBe(expectedQuery);
  });

  it('Query with simple filters', async () => {
    const filters = {
      name: {
        $eq: 'marmolei',
      },
    };

    director.makeQueryFromQueryFilters(filters);

    const sql = await qb.debugQuery();

    const expectedQuery = `SELECT "cats"."id" AS "cats_id", "cats"."name" AS "cats_name", "cats"."age" AS "cats_age", "cats"."breed" AS "cats_breed" FROM "cat" "cats" WHERE "cats"."name" = :name`;

    expect(sql).toBe(expectedQuery);
  });
  it('Query with complex filters', async () => {
    const filters = {
      $and: [
        { $and: [{ age: { $lt: 3 } }, { age: { $gt: 0 } }] },
        { name: { $eq: 'marmolei' } },
      ],
    };

    director.makeQueryFromQueryFilters(filters);

    const sql = await qb.debugQuery();

    const expectedQuery = `SELECT "cats"."id" AS "cats_id", "cats"."name" AS "cats_name", "cats"."age" AS "cats_age", "cats"."breed" AS "cats_breed" FROM "cat" "cats" WHERE ("cats"."name" = :name_0 AND ("cats"."age" < :age_0 AND "cats"."age" > :age_1))`;

    expect(sql).toBe(expectedQuery);
  });

  it('Query with relations', async () => {
    const relations = {
      tags: '*',
    };

    director.loadRelations(relations);

    const sql = await qb.debugQuery();

    const expectedQuery = `SELECT "cats"."id" AS "cats_id", "cats"."name" AS "cats_name", "cats"."age" AS "cats_age", "cats"."breed" AS "cats_breed", "tags"."id" AS "tags_id", "tags"."tagNameId" AS "tags_tagNameId", "tags"."catId" AS "tags_catId" FROM "cat" "cats" LEFT JOIN "tag" "tags" ON "tags"."catId"="cats"."id"`;

    expect(sql).toBe(expectedQuery);
  });

  it('Query with nested relations', async () => {
    const relations = {
      tags: {
        tagName: '*',
      },
    };

    director.loadRelations(relations);

    const sql = await qb.debugQuery();

    const expectedQuery = `SELECT "cats"."id" AS "cats_id", "cats"."name" AS "cats_name", "cats"."age" AS "cats_age", "cats"."breed" AS "cats_breed", "tags"."id" AS "tags_id", "tags"."tagNameId" AS "tags_tagNameId", "tags"."catId" AS "tags_catId", "tagName"."id" AS "tagName_id", "tagName"."value" AS "tagName_value" FROM "cat" "cats" LEFT JOIN "tag" "tags" ON "tags"."catId"="cats"."id"  LEFT JOIN "tag_name" "tagName" ON "tagName"."id"="tags"."tagNameId"`;

    expect(sql).toBe(expectedQuery);
  });

  it('Query with nested relations and filters', async () => {
    const relations = {
      tags: {
        tagName: {
          filters: {
            $or: [{ value: { $eq: 'TAG_1' } }, { value: { $eq: 'TAG_2' } }],
          },
        },
      },
    };

    director.loadRelations(relations);

    const sql = await qb.debugQuery();

    const expectedQuery = `SELECT "cats"."id" AS "cats_id", "cats"."name" AS "cats_name", "cats"."age" AS "cats_age", "cats"."breed" AS "cats_breed", "tags"."id" AS "tags_id", "tags"."tagNameId" AS "tags_tagNameId", "tags"."catId" AS "tags_catId", "tagName"."id" AS "tagName_id", "tagName"."value" AS "tagName_value" FROM "cat" "cats" LEFT JOIN "tag" "tags" ON "tags"."catId"="cats"."id"  LEFT JOIN "tag_name" "tagName" ON "tagName"."id"="tags"."tagNameId" WHERE ("tagName"."value" = :value_0 OR "tagName"."value" = :value_1)`;

    expect(sql).toBe(expectedQuery);
  });
});
