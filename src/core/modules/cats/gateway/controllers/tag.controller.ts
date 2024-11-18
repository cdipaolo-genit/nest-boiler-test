import { Body, Controller, Post } from '@nestjs/common';
import { BaseController } from 'src/core/commons/gateway/controllers/base.controller';

import { ApiResponse } from '@nestjs/swagger';
import { Tag } from '../../domain/entities/tag.entity';
import { CreateTagDto } from '../../domain/dtos/tag-create.dto';
import {
  CreateTagUseCase,
  DeleteTagUseCase,
  GetAllTagsUseCase,
  GetOneTagUseCase,
  UpdateTagUseCase,
} from '../../domain/usecases/crud-tag.usecase';

@Controller('tags')
export class TagController extends BaseController<Tag, CreateTagDto> {
  constructor(
    getOneUseCase: GetOneTagUseCase,
    getAllUseCase: GetAllTagsUseCase,
    createUseCase: CreateTagUseCase,
    deleteUseCase: DeleteTagUseCase,
    updateUseCase: UpdateTagUseCase,
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
    type: Tag,
  })
  async create(@Body() doc: CreateTagDto) {
    return await this.createUseCase.execute(doc as any);
  }
}
