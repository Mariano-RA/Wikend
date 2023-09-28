/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './dto/login.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async verifySession(dto: AuthDto) {
    const { correo, password } = dto;
    console.log(dto);
    const user = await this.userRepository.findOne({
      where: {
        correo: correo,
      },
      relations: {
        permisos: true,
      },
    });

    console.log(user);

    if (!user) {
      return new NotFoundException(
        'No existe un usuario registrado con ese correo.',
      );
    } else if (user.password != password) {
      return new BadRequestException('La contraseña es incorrecta.');
    } else {
      return user;
    }
  }
}
