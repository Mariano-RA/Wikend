import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateReservationDto {
  fechaReservaDesde: Date;
  fechaReservaHasta: Date;
  product: Product;
  user: User;
}
