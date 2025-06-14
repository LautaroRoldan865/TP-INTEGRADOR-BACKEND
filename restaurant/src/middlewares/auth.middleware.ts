import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Permissions } from './decorators/permissions.decorator';
import { AxiosService } from 'src/axios/axios';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector:Reflector,
    private serviceAxios: AxiosService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {

    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.replace('Bearer ','');
      if (token == null) {
        throw new Error('El token no existe');
      }
      //AGREGAR LOGICA PARA USAR LOS PERMISOS QUE VIENEN EN EL DECORADOR
      const permisosRequeridos :string = this.reflector.get<string>(Permissions, context.getHandler());

      const tienePermiso = await this.serviceAxios.getData(token,permisosRequeridos)

      if (!tienePermiso) {
        throw new Error('No tienes permisos suficientes');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(error?.message);
    }
  }
}
