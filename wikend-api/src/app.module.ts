import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { PermissionModule } from './permission/permission.module';
import { Permission } from './permission/entities/permission.entity';
import { Product } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { Reservation } from './reservation/entities/reservation.entity';
import { ReservationModule } from './reservation/reservation.module';
import { FileModule } from './file/file.module';
import { File } from './file/entities/file.entity';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    UserModule,
    PermissionModule,
    CategoryModule,
    ReservationModule,
    FileModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './database/DBwiken.sqlite',
      entities: [Category, Product, User, Permission, Reservation, File],
      synchronize: true,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'db.ctd.academy',
    //   port: 3306,
    //   username: '0723TDPRON2C03LAED0222PT_GRUPO6',
    //   password: 'IiXu2Zee',
    //   database: '0723TDPRON2C03LAED0222PT_GRUPO6',
    //   entities: [Category, Product, User, Permission, Reservation, File],
    //   synchronize: true,
    // }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '/client'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
