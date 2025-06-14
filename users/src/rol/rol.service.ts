import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/entities/permision.entity';
import { RolEntity } from 'src/entities/rol.entity';
import { PermissionService } from 'src/permission/permission.service';
import { Repository } from 'typeorm';


@Injectable()
export class RolService {
    constructor(
        @InjectRepository(RolEntity)
        private RolRepo: Repository<RolEntity>,
        private PermissionService: PermissionService,
    ){}
    //post
    create(Rol:Partial<RolEntity>): Promise<RolEntity>{
        const newRol = this.RolRepo.create(Rol)
        return this.RolRepo.save(newRol)
    }

    //get
    findAll():Promise<RolEntity[]>{
        return this.RolRepo.find()
    }
    //get id
    findOne(id:number):Promise<RolEntity | null>{
        return this.RolRepo.findOneBy({id});
    }

    findWithPermitions(id:number){
        return this.RolRepo.findOneBy({id});
    }
    //put
    async update(id:number, rol:RolEntity): Promise<RolEntity |null>{
        await this.RolRepo.update(id,rol);
        return this.RolRepo.findOneBy({id});
    }
    //inyecctamos el service de permiso en rol
    async findPermissions(id:number):Promise<PermissionEntity[]>{
        var Service = await this.PermissionService.filterService(id);
        return Service
    }

    async addPermision(id:number,idPermission:number){
        const permission :PermissionEntity = await this.PermissionService.findOne(idPermission)
        const rol = await this.RolRepo.findOne({where: { id },relations: ['permission'],});
        const result = rol.permission.some((permission)=> permission.id === (idPermission))
        if(!permission){
            throw new NotFoundException(`permission not exist with the id: ${idPermission}`);
        }else if(!rol){
            throw new NotFoundException(`rol not exist with the id: ${id}`);
        }else if(result){
            throw new NotFoundException(`este rol ya esta asignado`);
        }

        rol.permission.push(permission)
        return await this.RolRepo.save(rol)
    }
    
    async updatePartion(id:number,rol:Partial<RolEntity>):Promise<RolEntity>{
        await this.RolRepo.update(id,rol);
        return this.RolRepo.findOneByOrFail({id});
    }

    async delete(id:number):Promise<void>{
        const rol = await this.RolRepo.findOneBy({id})
        if(!rol){
            throw new NotFoundException(`permission not exist with the id: ${id}`);
        }
        await this.RolRepo.softRemove(rol);
    }
}
    



