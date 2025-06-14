import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantEntity } from '../entities/restaurant.entity';
import { MenuEntity } from 'src/entities/menu.entity';
import { AddressEntity } from 'src/entities/address.entity'; 
import { LocationEntity } from '../entities/location.entity';
import { MenuService } from 'src/menu/menu.service';
import {paginate,Pagination,IPaginationOptions} from 'nestjs-typeorm-paginate';



@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(RestaurantEntity)
        private restaurantRepository: Repository<RestaurantEntity>,

        @InjectRepository(AddressEntity)
        private addressRepository: Repository<AddressEntity>,

        @InjectRepository(LocationEntity)
        private locationRepository: Repository<LocationEntity>,

        private menuService:MenuService
    ) {}


    create(Restaurant:Partial<RestaurantEntity>) :Promise<RestaurantEntity> {
        const newRestaurant = this.restaurantRepository.create(Restaurant)
        return this.restaurantRepository.save(Restaurant)
    }

    findAll():Promise<RestaurantEntity[]>{
        return this.restaurantRepository.find();
    }

    findOne(id:number):Promise<RestaurantEntity |null>{
        return this.restaurantRepository.findOneBy({id});
    }

    async update(id:number, restaurant:RestaurantEntity):Promise<RestaurantEntity>{
        await this.restaurantRepository.update(id,restaurant);
        return this.restaurantRepository.findOneByOrFail({id});
    }


    async updatePartion(id:number,restaurant:Partial<RestaurantEntity>):Promise<RestaurantEntity>{
        await this.restaurantRepository.update(id,restaurant);
        return this.restaurantRepository.findOneByOrFail({id});
    }

    async delete(id:number):Promise<void>{
        const restaurant = await this.restaurantRepository.findOneBy({id})

        if(!restaurant){
            throw new NotFoundException(`restaurant not exist with the id: ${id}`);
        }

        await this.restaurantRepository.softRemove(restaurant);
        
    }

    async findMenu(id:number):Promise<MenuEntity[]>{
        var Menus = await this.menuService.filterMenu(id) ;
        return Menus
    }

    async createRestaurant (data: {
        name: string,
        address: {
            street:string,
            number:string,
            cityId:number,
            location:{
                lat: number,
                lng: number,
            }
        },
        imageUrl: string
    }):Promise <RestaurantEntity>{

        const newLocation = this.locationRepository.create({
            lat: data.address.location.lat.toString(),
            lng: data.address.location.lng.toString(),
        });

        const savedLocation = await this.locationRepository.save(newLocation);

        const newAddress = this.addressRepository.create({
            ...data.address,
            location: savedLocation
        });

        const savedAddress = await this.addressRepository.save(newAddress);

        const newRestaurant = this.restaurantRepository.create({
            name: data.name,
            imageUrl: data.imageUrl,
            address: savedAddress,
        });

        return await this.restaurantRepository.save(newRestaurant);
    }
    
    async paginate(options: IPaginationOptions): Promise<Pagination<RestaurantEntity>>{
        const queryBuilder = this.restaurantRepository.createQueryBuilder('r');
        queryBuilder.orderBy('r.name','DESC');

        return paginate<RestaurantEntity>(this.restaurantRepository,options);
    }



}
