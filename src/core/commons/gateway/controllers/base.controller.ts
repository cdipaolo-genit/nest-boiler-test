import { BaseEntity } from 'typeorm';
import {
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  Req,
  HttpCode,
  Patch,
} from '@nestjs/common';
import {
  CreateUseCase,
  DeleteUseCase,
  GetAllUseCase,
  GetOneUseCase,
  UpdateUseCase,
} from 'src/core/commons/domain/usecases/crud.usecase';
import { ValidateFiltersPipe } from '../pipes/validate-filters.pipe';
import { ValidatePaginationPipe } from '../pipes/validate-pagination.pipe';
import { ResponseInterceptor } from '../interceptors/paginated-response.interceptor';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidateSortPipe } from '../pipes/validate-sort.pipe';
import { ValidatePopulationPipe } from '../pipes/validate-population.pipe';

@UseInterceptors(ResponseInterceptor)
export abstract class BaseController<T extends BaseEntity, CreateDto> {
  constructor(
    protected readonly getOneUseCase: GetOneUseCase<T>,
    protected readonly getAllUseCase: GetAllUseCase<T>,
    protected readonly createUseCase: CreateUseCase<T>,
    protected readonly deleteUseCase: DeleteUseCase<T>,
    protected readonly updateUseCase: UpdateUseCase<T>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'basic get all for this entity' })
  @ApiResponse({
    status: 200,
    description: 'The found records with metadada for pagination',
  })
  async findAll(
    @Query('filters', ValidateFiltersPipe) filters: any,
    @Query('pagination', ValidatePaginationPipe) pagination: any,
    @Query('sort', ValidateSortPipe) sort: any,
    @Query('relations', ValidatePopulationPipe) relations: any,
    @Req() req: any,
  ) {
    const [data, total] = await this.getAllUseCase.execute({
      filters,
      pagination,
      sort,
      relations,
    });

    req.pagination = { ...pagination, total };

    return data;
  }

  @Get(':id')
  @ApiOperation({ summary: 'basic get one for this entity' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.getOneUseCase.execute(id);
  }

  // For dto validation, overwrite the method in subclass
  @Post()
  @ApiOperation({ summary: 'basic create for this entity' })
  @ApiResponse({
    status: 201,
    description: 'The record that was created',
  })
  async create(@Body() doc: CreateDto) {
    return await this.createUseCase.execute(doc as unknown as T);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'basic delete for this entity' })
  @ApiResponse({
    status: 204,
    description: 'No content',
  })
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.deleteUseCase.execute(id);
  }

  // TODO: add custom validation pipe based on entity
  @Patch(':id')
  @ApiOperation({ summary: 'basic update for this entity' })
  @ApiResponse({
    status: 200,
    description: 'The record updated',
  })
  async update(@Param('id', ParseIntPipe) id: number, @Body() doc: T) {
    return await this.updateUseCase.execute(id, doc);
  }
}
