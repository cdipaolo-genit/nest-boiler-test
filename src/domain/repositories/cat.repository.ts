import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { Cat } from '../entities/cat.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class CatRepository extends BaseRepository<Cat> {
  constructor(dataSource: DataSource) {
    super(Cat, dataSource);
  }
}
