import { Body, Controller, Post } from '@nestjs/common';
import { Cat } from '../../domain/entities/cat.entity';
import { BaseController } from 'src/core/commons/gateway/controllers/base.controller';
import {
  CreateCatUseCase,
  DeleteCatUseCase,
  GetAllCatsUseCase,
  GetOneCatUseCase,
  UpdateCatUseCase,
} from '../../domain/usecases/crud-cat.usecase';
import { CreateCatDto } from '../../domain/dtos/cat-create.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/core/commons/gateway/guards/roles.decorator';

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
  @Roles(['ADMIN'])
  async create(@Body() doc: CreateCatDto) {
    return await this.createUseCase.execute(doc as any);
  }
}
