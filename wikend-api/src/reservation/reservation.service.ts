import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const newReserva = new Reservation();
    newReserva.created_at = new Date();
    newReserva.fechaReservaDesde = createReservationDto.fechaReservaDesde;
    newReserva.fechaReservaHasta = createReservationDto.fechaReservaHasta;
    newReserva.producto = createReservationDto.product;
    newReserva.user = createReservationDto.user;

    await this.reservationRepository.save(newReserva);
  }

  async findAll() {
    try {
      const arrReserva = await this.reservationRepository.find({
        relations: {
          producto: true,
          user: true,
        },
      });
      return arrReserva;
    } catch (error) {
      return error;
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} reservation`;
  // }

  // update(id: number, updateReservationDto: UpdateReservationDto) {
  //   console.log(updateReservationDto);
  //   return `This action updates a #${id} reservation`;
  // }

  async remove(id: number) {
    try {
      return await this.reservationRepository.delete(id);
    } catch (error) {
      return error;
    }
  }
}
