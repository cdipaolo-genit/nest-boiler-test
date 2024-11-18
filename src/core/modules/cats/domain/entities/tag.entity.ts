import {
  BaseEntity,
  Entity,
  JoinColumn,
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
  @JoinColumn()
  tagName: TagName;

  @ManyToOne(() => Cat, { cascade: true })
  cat: Cat;
}
