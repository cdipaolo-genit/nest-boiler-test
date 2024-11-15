import { BaseEntity } from 'typeorm';
import {
  Get,
  Post,
  Delete,
  Body,
  Injectable,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseInterceptors,
  Req,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  CreateUseCase,
  DeleteUseCase,
  GetAllUseCase,
  GetOneUseCase,
  UpdateUseCase,
} from '../../domain/usecases/base/crud.usecase';
import { ValidateFiltersPipe } from '../pipes/validate-filters.pipe';
import { ValidatePaginationPipe } from '../pipes/validate-pagination.pipe';
import { ResponseInterceptor } from '../interceptors/paginated-response.interceptor';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidateSortPipe } from '../pipes/validate-sort.pipe';

@Injectable()
@UseInterceptors(ResponseInterceptor)
export abstract class BaseController<T extends BaseEntity, CreateDto> {
  constructor(
    protected readonly getOneUseCase: GetOneUseCase<T>,
    protected readonly getAllUseCase: GetAllUseCase<T>,
    protected readonly createUseCase: CreateUseCase<T>,
    protected readonly deleteUseCase: DeleteUseCase<T>,
    protected readonly updateUseCase: UpdateUseCase<T>,
  ) {}

  // TODO: Add custom dto for swagger filters
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
    @Req() req: any,
  ) {
    const [data, total] = await this.getAllUseCase.execute(
      filters,
      pagination,
      sort,
    );

    pagination.total = total;

    if (!(pagination?.skip + 1) || !pagination.take) return data;

    const page = pagination.skip / pagination.take + 1;
    const pageSize = pagination.take;

    if (page * pageSize > total)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `The page ${page} is out of range`,
          error: 'page_out_of_range',
        },
        HttpStatus.BAD_REQUEST,
      );

    req.pagination = {
      total,
      page,
      pageSize,
      next: (page + 1) * pageSize > total ? null : page + 1,
      prev: page - 1 < 1 ? null : page - 1,
    };

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
  @Put(':id')
  @ApiOperation({ summary: 'basic update for this entity' })
  @ApiResponse({
    status: 200,
    description: 'The record updated',
  })
  async update(@Param('id', ParseIntPipe) id: number, @Body() doc: T) {
    return await this.updateUseCase.execute(id, doc);
  }
}
