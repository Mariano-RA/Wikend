import { Permission } from 'src/permission/entities/permission.entity';

export class CreateUserDto {
  nombre: string;
  apellido: string;
  ciudad: string;
  correo: string;
  password: string;
  permisos: Permission[];
}
