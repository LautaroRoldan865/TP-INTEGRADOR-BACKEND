import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserEntity } from 'src/entities/user.entity';
import { RequestWithUser } from 'src/interfaces/request-user';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { Permissions } from './decorators/permissions.decorator';
import { PermissionEntity } from 'src/entities/permision.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private reflector:Reflector
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {

    try {
      const request: RequestWithUser = context.switchToHttp().getRequest();
      const token = request.headers.authorization.replace('Bearer ','');
      if (token == null) {
        throw new Error('El token no existe');
      }
      const payload = this.jwtService.getPayload(token);
      const user = await this.usersService.findByEmail(payload.email);
      request.user = user;
      console.log(user)
      
      //AGREGAR LOGICA PARA USAR LOS PERMISOS QUE VIENEN EN EL DECORADOR
      
      const permisosRequeridos :string[] = this.reflector.get<string[]>(Permissions, context.getHandler()) || [];
      const permisosUsuario = user?.rol?.permission || [];

      console.log(permisosUsuario)

      const tienePermiso = permisosRequeridos.every((p) => permisosUsuario.some(pu => pu.nombre === p));

      if (!tienePermiso) {
        throw new Error('No tienes permisos suficientes');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(error?.message);
    }
  }
}
