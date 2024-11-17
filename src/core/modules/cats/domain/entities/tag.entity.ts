import {
  BaseEntity,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cat } from './cat.entity';
import { TagName } from './tag-name.entity';

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TagName)
  name: TagName;

  @ManyToOne(() => Cat)
  cat: Cat;
}
