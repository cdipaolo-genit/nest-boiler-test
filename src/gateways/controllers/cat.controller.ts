import { Body, Controller, Post } from '@nestjs/common';
import { Cat } from '../../domain/entities/cat.entity';
import { BaseController } from './base.controller';
import {
  CreateCatUseCase,
  DeleteCatUseCase,
  GetAllCatsUseCase,
  GetOneCatUseCase,
  UpdateCatUseCase,
} from 'src/domain/usecases/cats/crud.usecase';
import { CreateCatDto } from 'src/domain/dtos/cat-create.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('cats')
export class CatController extends BaseController<Cat, CreateCatDto> {
  constructor(
    getOneUseCase: GetOneCatUseCase,
    getAllUseCase: GetAllCatsUseCase,
    createUseCase: CreateCatUseCase,
    deleteUseCase: DeleteCatUseCase,
    updateUseCase: UpdateCatUseCase,
  ) {
    super(
      getOneUseCase,
      getAllUseCase,
      createUseCase,
      deleteUseCase,
      updateUseCase,
    );
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record that was created',
    type: Cat,
  })
  async create(@Body() doc: CreateCatDto) {
    return await this.createUseCase.execute(doc as any);
  }
}
