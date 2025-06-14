import { Controller, Post,Get,Delete,Put,Patch,Body,Param, UseGuards } from '@nestjs/common';
import { MenuEntity } from '../entities/menu.entity';
import { MenuService } from './menu.service';
import { RestaurantEntity } from 'src/entities/restaurant.entity';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import {Permissions} from '../middlewares/decorators/permissions.decorator'

interface Menu {
    idMenu:number,
    name:string,
    description:string,
    price:number,
    imageUrl:string,
    restaurant :RestaurantEntity,
}

@Controller('menu')
export class MenuController {
    constructor(private readonly MenuService:MenuService ){}

    @UseGuards(AuthGuard)
    @Permissions('create_menu')
    @Post('crear')
    create(@Body() createMenu : Partial<MenuEntity>){
        return this.MenuService.create(createMenu)
    }

    @UseGuards(AuthGuard)
    @Permissions('conocer_menu')
    @Get()
    findAll(): Promise<MenuEntity[]>{
        return this.MenuService.findAll();
    }

    @UseGuards(AuthGuard)
    @Permissions('conocer_menu')
    @Get(':id')
    findOne(@Param('id') id:number):Promise<MenuEntity |null>{
        return this.MenuService.findOne(id);
    }
    
    @UseGuards(AuthGuard)
    @Permissions('mod_menu')
    @Put(':id')
    update(@Param('id') id: number,@Body() Menu:MenuEntity):Promise<MenuEntity>{
        return this.MenuService.update(id,Menu)
    }

    @UseGuards(AuthGuard)
    @Permissions('mod_menu')
    @Patch(':id')
    updatepartial(@Param('id') id:number,@Body() menu:Partial<MenuEntity>):Promise<MenuEntity>{
        return this.MenuService.updatePartion(id,menu);
    }

    @UseGuards(AuthGuard)
    @Permissions('borrar_menu')
    @Delete(':id')
    delete(@Param('id') id:number):Promise<void>{
        return this.MenuService.delete(id);
    }

}
