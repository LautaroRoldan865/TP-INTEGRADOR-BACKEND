import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/entities/permision.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common'; 
import { RolEntity } from 'src/entities/rol.entity';


@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(PermissionEntity)
        private PersmissionRepo : Repository<PermissionEntity>, 
    ){}

    createPermission(permission: Partial<PermissionEntity>){
        const newPermission = this.PersmissionRepo.create(permission)
        return this.PersmissionRepo.save(newPermission)
    }

    async findAll():Promise<PermissionEntity[]>{
        return await this.PersmissionRepo.find()
    }

    async findOne(id:number):Promise<PermissionEntity | null>{
        return await this.PersmissionRepo.findOneBy({id})
    }

    async update(id:number, permission:PermissionEntity):Promise<PermissionEntity>{
        await this.PersmissionRepo.update(id,permission);
        return this.PersmissionRepo.findOneByOrFail({id});
    }

    async filterService(id:number):Promise<PermissionEntity[]>{

        let permission = await this.PersmissionRepo.find()

        function permissionFilter(rol:number){
            return permission.filter((permission)=> permission.rol.every((Role)=>Role.id === rol))
        }

        return permissionFilter(id);
    }

    

    async updatePartion(id:number,permission:Partial<PermissionEntity>):Promise<PermissionEntity>{
        await this.PersmissionRepo.update(id,permission);
        return this.PersmissionRepo.findOneByOrFail({id});
    }

    async delete(id:number):Promise<void>{
        const permission = await this.PersmissionRepo.findOneBy({id})
        if(!permission){
            throw new NotFoundException(`permission not exist with the id: ${id}`);
        }
        await this.PersmissionRepo.softRemove(permission);
    }
}
