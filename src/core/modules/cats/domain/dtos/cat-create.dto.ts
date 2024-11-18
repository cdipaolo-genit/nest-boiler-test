import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCatDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'marmolei', description: 'The name of the Cat' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1, description: 'The age of the Cat' })
  age: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'carei', description: 'The breed of the Cat' })
  breed: string;
}
