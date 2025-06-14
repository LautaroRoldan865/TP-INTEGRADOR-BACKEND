import { Controller } from '@nestjs/common';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import { Permissions } from 'src/middlewares/decorators/permissions.decorator';
import { UseGuards } from '@nestjs/common';
import { Post,Get,Param,Put,Patch,Delete } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { PermissionEntity } from 'src/entities/permision.entity';
import { PermissionService } from './permission.service';
import { Body } from '@nestjs/common';


@Controller('permission')
export class PermissionController {

    constructor (private readonly service: PermissionService){}

    @UseGuards(AuthGuard)
    @Permissions(['create_permission'])
    @Post()
    async create(@Req()request: Request,@Body() Permissions: PermissionEntity){
        return this.service.createPermission(Permissions)
    }

    @Get()
    findAll(): Promise<PermissionEntity[]>{
        return this.service.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id:number):Promise<PermissionEntity |null>{
        return this.service.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number,@Body() permiso:PermissionEntity):Promise<PermissionEntity>{
        return this.service.update(id,permiso)
    }

    @Patch(':id')
    updatepartial(@Param('id') id:number,@Body() permiso:Partial<PermissionEntity>):Promise<PermissionEntity>{
        return this.service.updatePartion(id,permiso);
    }

    @Delete(':id')
    delete(@Param('id') id:number):Promise<void>{
        return this.service.delete(id);
    }
    
}
