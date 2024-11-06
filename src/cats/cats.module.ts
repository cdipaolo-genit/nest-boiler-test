import { Global, Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './cat.entity';

@Global() // modulo global, databases, helpers, etc
@Module({
  controllers: [CatsController],
  providers: [CatsService], // los providers estan encapsulados en el alcance del modulo
  exports: [CatsService], // esto permite que todos los modulos que importen CatsModule usen la misma instancia del service
  imports: [TypeOrmModule.forFeature([Cat])],
})
export class CatsModule {}
