import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ReservationModule } from 'src/reservation/reservation.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ReservationModule, FileModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
