import { Injectable } from '@nestjs/common';
import { Cat } from './cat.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat as CatE } from './cat.entity';
import { Repository } from 'typeorm';

// definimos la clase como provider
@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  constructor(
    @InjectRepository(CatE) private catsRepository: Repository<CatE>,
  ) {}

  async create(cat: Cat) {
    console.log(cat);
    this.catsRepository.insert(cat);
  }

  async findAll(): Promise<Cat[]> {
    return this.catsRepository.find();
  }
}
