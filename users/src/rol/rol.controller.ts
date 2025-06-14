import { Body, Controller, Post, Req, UseGuards, Get, Put, Patch, Delete, Param } from '@nestjs/common';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import { Permissions } from '../middlewares/decorators/permissions.decorator'
import { RolService } from './rol.service';
import { RolEntity } from 'src/entities/rol.entity';
import { PermissionEntity } from 'src/entities/permision.entity';


interface RequestWithRol extends Request{
    rol: RolEntity
}

interface Intpermision{
    id:number
}

@Controller('rol')
export class RolController {
    constructor (private readonly service: RolService){}

    @UseGuards(AuthGuard)
    @Permissions(['create_role'])
    @Post()
    async create(@Req()request: RequestWithRol){
        return this.service.create(request.rol)
    }

    //@UseGuards(AuthGuard)
    //@Permissions(['assign_permission'])
    @Post(':id')
    async addPermision(@Param('id') id:number,@Body() Permission: Intpermision){
        return this.service.addPermision(id,Permission.id)
    }

    @Get()
    findAll(): Promise<RolEntity[]>{
        return this.service.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id:number):Promise<RolEntity |null>{
        return this.service.findOne(id);
    }

    @Get(':id')
    findPermissions(@Param('id') id:number):Promise<PermissionEntity[]>{
        return this.service.findPermissions(id);
    }

    @Put(':id')
    update(@Param('id') id: number,@Body() rol:RolEntity):Promise<RolEntity>{
        return this.service.update(id,rol)
    }

    @Patch(':id')
    updatepartial(@Param('id') id:number,@Body() rol:Partial<RolEntity>):Promise<RolEntity>{
        return this.service.updatePartion(id,rol);
    }

    @Delete(':id')
    delete(@Param('id') id:number):Promise<void>{
        return this.service.delete(id);
    }

    //insomnia o postman --> Cliente de api
}
