import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  key: string;

  @Column('text')
  url: string;

  @ManyToOne(() => Product, (product) => product.files)
  producto: Product;
}
