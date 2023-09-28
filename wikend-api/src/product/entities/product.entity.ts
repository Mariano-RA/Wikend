import { Category } from 'src/category/entities/category.entity';
import { File } from 'src/file/entities/file.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column('float')
  precio: number;

  @Column('text')
  duracion: string;

  @Column('text')
  participantes: string;

  @Column('text')
  incluye: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.producto)
  reservas: Reservation[];

  @ManyToMany(() => Category, (category) => category.productos)
  @JoinTable()
  categorias: Category[];

  @OneToMany(() => File, (file) => file.producto, { cascade: true })
  files: File[];
}
