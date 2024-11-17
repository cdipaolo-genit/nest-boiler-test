import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/core/commons/domain/repositories/base.repository';
import { DataSource } from 'typeorm';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagRepository extends BaseRepository<Tag> {
  constructor(dataSource: DataSource) {
    super(Tag, dataSource);
  }
}
