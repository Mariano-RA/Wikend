/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductFilterDto } from './dto/product-filter.dto';
import { File } from 'src/file/entities/file.entity';
import { FileService } from 'src/file/file.service';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { ReservationService } from 'src/reservation/reservation.service';

function pagination(skip, take, items) {
  return items.slice((skip - 1) * take, skip * take);
}

function handleOrder(action, array) {
  const sortedArray = [...array];

  const sortingActions = {
    mayor: (a, b) => b.precio - a.precio,
    menor: (a, b) => a.precio - b.precio,
    nombreAsc: (a, b) =>
      a.producto.toLowerCase().localeCompare(b.producto.toLowerCase()),
    nombreDesc: (a, b) =>
      b.producto.toLowerCase().localeCompare(a.producto.toLowerCase()),
  };

  if (sortingActions[action]) {
    sortedArray.sort(sortingActions[action]);
  } else {
    console.warn(`Acción de ordenamiento desconocida: ${action}`);
  }

  return sortedArray;
}

@Injectable()
export class ProductService {
  @Inject(ReservationService)
  private readonly reservationService: ReservationService;
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly fileService: FileService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const prodExistente = await this.productRepository.findOne({
        where: {
          titulo: createProductDto.titulo,
        },
      });

      if (!prodExistente) {
        await this.productRepository.save({
          titulo: createProductDto.titulo,
          descripcion: createProductDto.descripcion,
          precio: createProductDto.precio,
          duracion: createProductDto.duracion,
          categorias: createProductDto.categorias,
          participantes: createProductDto.participantes,
          incluye: createProductDto.incluye,
          files: createProductDto.files,
          reservas: createProductDto.reservas,
          created_at: new Date(),
        });
      } else {
        return new BadRequestException('Ya existe un producto con ese titulo.');
      }
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    try {
      const arrProduct = await this.productRepository.find({
        relations: {
          categorias: true,
          reservas: true,
          files: true,
        },
      });
      return arrProduct;
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          categorias: true,
          reservas: true,
          files: true,
        },
      });
      if (!product) {
        throw new NotFoundException('El producto no existe');
      } else {
        return product;
      }
    } catch (error) {
      return error;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      // Obtén el producto existente de la base de datos
      const existingProduct = await this.productRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          categorias: true,
          reservas: true,
          files: true,
        },
      });

      if (!existingProduct) {
        // Producto no encontrado, manejar este caso según tus necesidades
        return null; // o lanza una excepción o retorna un mensaje de error
      }

      // Actualiza las propiedades del producto con los valores del DTO
      existingProduct.titulo = updateProductDto.titulo;
      existingProduct.descripcion = updateProductDto.descripcion;
      existingProduct.precio = updateProductDto.precio;
      existingProduct.duracion = updateProductDto.duracion;
      existingProduct.descripcion = updateProductDto.duracion;
      existingProduct.participantes = updateProductDto.participantes;
      existingProduct.incluye = updateProductDto.incluye;
      existingProduct.updated_at = new Date();

      // Actualiza las imágenes (files) si se proporcionan en el DTO
      if (updateProductDto.files) {
        // Mapea los datos de las imágenes recibidas al formato de tu entidad `File`
        const newFiles = updateProductDto.files.map((fileData) => {
          const file = new File();
          file.key = fileData.key;
          file.url = fileData.url;
          return file;
        });

        // Asigna las nuevas imágenes al producto existente
        existingProduct.files = newFiles;
      }

      // Guarda el producto actualizado en la base de datos
      const updatedProduct = await this.productRepository.save(existingProduct);

      return updatedProduct;
    } catch (error) {
      return error;
    }
  }

  async remove(id: number) {
    try {
      // Obtén el producto existente de la base de datos
      const existingProduct = await this.productRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          categorias: true,
          reservas: true,
          files: true,
        },
      });

      if (existingProduct) {
        if (existingProduct.files.length > 0) {
          for (const file of existingProduct.files) {
            if (file.id) {
              await this.fileService.deleteS3File(file.key);
            }
          }
        }

        if (existingProduct.reservas.length > 0) {
          for (const reserva of existingProduct.reservas) {
            if (reserva.id) {
              await this.reservationService.remove(reserva.id);
            }
          }
        }

        existingProduct.files = [];
        existingProduct.reservas = [];
        existingProduct.categorias = [];
        await this.productRepository.save(existingProduct);
        return await this.productRepository.delete(id);
      }

      return new NotFoundException(
        'No existe un producto con el ID seleccionado.',
      );
    } catch (error) {
      return error;
    }
  }

  async findProducts(filterDto: ProductFilterDto) {
    if (filterDto.fechaDesde === undefined) {
      filterDto.fechaDesde = null;
    }
    if (filterDto.fechaHasta === undefined) {
      filterDto.fechaHasta = null;
    }
    const { categoria, fechaDesde, fechaHasta } = filterDto;

    let listadoPalabras = [];
    if (categoria.includes(' ')) {
      listadoPalabras = categoria.split(' ');
    } else {
      listadoPalabras.push(categoria);
    }
    let listadoProductos = [];

    const arrProduct = await this.productRepository.find({
      relations: {
        categorias: true,
        reservas: true,
        files: true,
      },
    });

    arrProduct.forEach((x) => {
      const categoriasEnMinusculas = x.categorias?.map((categoria) =>
        categoria.descripcion.toLowerCase(),
      );
      if (
        listadoPalabras.some((word) =>
          categoriasEnMinusculas.includes(word.toLowerCase()),
        )
      ) {
        listadoProductos.push(x);
      }
    });
    listadoProductos = listadoProductos.filter((product) =>
      listadoPalabras.every(
        (keyword) =>
          product.categorias?.map((categoria) =>
            categoria.descripcion.toLowerCase().includes(keyword.toLowerCase()),
          ),
      ),
    );
    listadoProductos = listadoProductos.filter(
      (prod) =>
        !prod.reservas?.some((reserva) => {
          if (fechaDesde !== null && fechaHasta !== null) {
            // Ambas fechas están presentes, comparamos con fechaReservaDesde y fechaReservaHasta
            return (
              reserva.fechaReservaDesde !== null &&
              reserva.fechaReservaHasta !== null &&
              reserva.fechaReservaDesde >= fechaDesde &&
              reserva.fechaReservaHasta <= fechaHasta
            );
          } else if (fechaDesde !== null) {
            // Solo fechaDesde está presente, comparamos con fechaReservaDesde
            return (
              reserva.fechaReservaDesde !== null &&
              reserva.fechaReservaDesde >= fechaDesde
            );
          } else if (fechaHasta !== null) {
            // Solo fechaHasta está presente, comparamos con fechaReservaHasta
            return (
              reserva.fechaReservaHasta !== null &&
              reserva.fechaReservaHasta <= fechaHasta
            );
          }
          // Si ninguna de las fechas está presente, no aplicamos filtro por fecha
          return true;
        }),
    );

    return listadoProductos;
  }
}
