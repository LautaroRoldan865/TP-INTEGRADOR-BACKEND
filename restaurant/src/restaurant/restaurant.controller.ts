import { Controller, Post,Get,Delete,Put,Patch,Body,Param, Query, DefaultValuePipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantEntity } from '../entities/restaurant.entity';
import { AddressEntity } from 'src/entities/address.entity';
import { MenuEntity } from 'src/entities/menu.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import {Permissions} from '../middlewares/decorators/permissions.decorator'


interface restaurant{
    name: string,
    address: {
        street: string,
        number:string,
        cityId: number,
        location:{
            lat: number,
            lng: number
        }
    },
    imageUrl: string
}

@Controller('restaurant')
export class RestaurantController {
    constructor(private readonly RestaurantService:RestaurantService ){}

    @UseGuards(AuthGuard)
    @Permissions('create_restaurant')
    @Post()
    createRestaurant(@Body() createrestaurant : restaurant): Promise<RestaurantEntity>{
        return this.RestaurantService.createRestaurant(createrestaurant)
    }

    @UseGuards(AuthGuard)
    @Permissions('consultar_restaurant')
    @Get('')
    findAll(): Promise<RestaurantEntity[]>{
        return this.RestaurantService.findAll();
    }

    @UseGuards(AuthGuard)
    @Permissions('consultar_restaurant')
    @Get('')
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<RestaurantEntity>>{
        limit = limit > 10 ? 10 : limit;
        return this.RestaurantService.paginate({page,limit,route: 'http://restaurant.com/restaurant'})
    }

    @UseGuards(AuthGuard)
    @Permissions('consultar_restaurante')
    @Get(':id')
    findOne(@Param('id') id:number):Promise<RestaurantEntity |null>{
        return this.RestaurantService.findOne(id);
    }

    @UseGuards(AuthGuard)
    @Permissions('mod_restaurant')
    @Put(':id')
    update(@Param('id') id: number,@Body() restaurant:RestaurantEntity):Promise<RestaurantEntity>{
        return this.RestaurantService.update(id,restaurant)
    }
    
    @UseGuards(AuthGuard)
    @Permissions('mod_restaurant')
    @Patch(':id')
    updatepartial(@Param('id') id:number,@Body() restaurant:Partial<RestaurantEntity>):Promise<RestaurantEntity>{
        return this.RestaurantService.updatePartion(id,restaurant);
    }

    @UseGuards(AuthGuard)
    @Permissions('borrar_restaurant')
    @Delete(':id')
    delete(@Param('id') id:number):Promise<void>{
        return this.RestaurantService.delete(id);
    }
    
    @UseGuards(AuthGuard)
    @Permissions('consultar_menu')
    @Get(':id')
    findMenu(@Param('id') id:number):Promise<MenuEntity[]>{
        return this.RestaurantService.findMenu(id);
    }

}
