import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { CreateCatDto, createCatSchema } from './create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './cat.interface';
import { ZodValidationPipe } from 'src/pipes/zod.validation';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roes.decorator';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';

@Controller('cats')
@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor)
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createCatSchema))
  @Roles(['admin'])
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }
}
