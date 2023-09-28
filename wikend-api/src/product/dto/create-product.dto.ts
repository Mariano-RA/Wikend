import { Category } from 'src/category/entities/category.entity';
import { File } from 'src/file/entities/file.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

export class CreateProductDto {
  titulo: string;
  descripcion: string;
  precio: number;
  duracion: string;
  participantes: string;
  incluye: string;
  files: File[];
  reservas: Reservation[];
  categorias: Category[];
}
