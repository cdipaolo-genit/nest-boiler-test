import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'tag name', description: 'tag name' })
  name: string;
}
