/* eslint-disable prettier/prettier */

import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  @Inject(EmailService) private readonly emailService: EmailService;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Verifica si el correo electrónico ya está registrado
    const existingUser = await this.userRepository.findOne({
      where: {
        correo: createUserDto.correo,
      },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const usuarioCreado = await this.userRepository.save({
      nombre: createUserDto.nombre,
      apellido: createUserDto.apellido,
      correo: createUserDto.correo,
      ciudad: createUserDto.ciudad,
      password: createUserDto.password,
      permisos: createUserDto.permisos,
    });
    if (usuarioCreado) {
      const content = `Bienvenido ${createUserDto.nombre}! \nIngresa aca para poder acceder a la pagina http://127.0.0.1:5173/home`;
      await this.emailService.sendEmail(
        createUserDto.correo,
        'Registro exitoso!',
        content,
      );
    }
  }
  catch(error) {
    return error;
  }

  async findAll() {
    try {
      const arrUser = await this.userRepository.find({
        relations: {
          permisos: true,
        },
      });
      return arrUser;
    } catch (error) {
      return error;
    }
  }

  async findById(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new NotFoundException('El usuario no existe');
      } else {
        return user;
      }
    } catch (error) {
      return error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.userRepository.save({
        id: id,
        nombre: updateUserDto.nombre,
        apellido: updateUserDto.apellido,
        correo: updateUserDto.correo,
        ciudad: updateUserDto.ciudad,
        password: updateUserDto.password,
        permisos: updateUserDto.permisos,
      });
    } catch (error) {
      return error;
    }
  }

  async remove(id: number) {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      return error;
    }
  }
}
