import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      await this.permissionRepository.save({
        descripcion: createPermissionDto.descripcion,
      });
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    try {
      const arrPermission = await this.permissionRepository.find({
        relations: {
          usuarios: true,
        },
      });
      return arrPermission;
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number) {
    try {
      const permission = await this.permissionRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!permission) {
        throw new NotFoundException('El permiso no existe');
      } else {
        return permission;
      }
    } catch (error) {
      return error.response;
    }
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      return await this.permissionRepository.save({
        id: id,
        descripcion: updatePermissionDto.descripcion,
      });
    } catch (error) {
      return error;
    }
  }

  async remove(id: number) {
    try {
      await this.permissionRepository.delete(id);
      return 'Se elimino el permiso correctamente';
    } catch (error) {
      return error;
    }
  }
}
