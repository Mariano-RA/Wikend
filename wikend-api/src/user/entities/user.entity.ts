import { Permission } from 'src/permission/entities/permission.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  nombre: string;

  @Column('text')
  apellido: string;

  @Column('text')
  correo: string;

  @Column('text')
  ciudad: string;

  @Column('text')
  password: string;

  @ManyToMany(() => Permission, (permission) => permission.usuarios)
  @JoinTable()
  permisos: Permission[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservas: Reservation[];
}
