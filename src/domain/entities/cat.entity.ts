import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cat extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'The id of the entity' })
  id: number;

  @Column()
  @ApiProperty({ example: 'marmolei', description: 'The name of the Cat' })
  name: string;

  @Column()
  @ApiProperty({ example: 1, description: 'The age of the Cat' })
  age: number;

  @Column()
  @ApiProperty({ example: 'carei', description: 'The breed of the Cat' })
  breed: string;
}
