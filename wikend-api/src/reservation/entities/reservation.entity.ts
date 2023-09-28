import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fechaReservaDesde: Date;

  @Column({ type: 'date' })
  fechaReservaHasta: Date;

  @ManyToOne(() => Product, (product) => product.reservas)
  producto: Product;

  @ManyToOne(() => User, (user) => user.reservas)
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
