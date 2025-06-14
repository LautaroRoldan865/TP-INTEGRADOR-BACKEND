import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuEntity } from '../entities/menu.entity';




@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(MenuEntity)
        private menuRepo: Repository<MenuEntity>,
        
    ){}

    create(menu:Partial<MenuEntity>) :Promise<MenuEntity> {
        const newMenu = this.menuRepo.create(menu)
        return this.menuRepo.save(menu)
    }

    findAll():Promise<MenuEntity[]>{
        return this.menuRepo.find();
    }

    async filterMenu(id:number):Promise<MenuEntity[]>{

        let Menus = await this.menuRepo.find()
        function menufiltrado(restaurant:number){
            return Menus.filter((menu) => menu.restaurant.id = restaurant);
        }

        return menufiltrado(id);
    }

    findOne(id:number):Promise<MenuEntity |null>{
        return this.menuRepo.findOneBy({id});
    }

    async update(id:number, menu:MenuEntity):Promise<MenuEntity>{
        await this.menuRepo.update(id,menu);
        return this.menuRepo.findOneByOrFail({id});
    }

    async updatePartion(id:number,menu:Partial<MenuEntity>):Promise<MenuEntity>{
        await this.menuRepo.update(id,menu);
        return this.menuRepo.findOneByOrFail({id});
    }
    
    async delete(id:number):Promise<void>{
        const menu = await this.menuRepo.findOneBy({id})
        if(!menu){
            throw new NotFoundException(`restaurant not exist with the id: ${id}`);
        }
        await this.menuRepo.softRemove(menu);  
    }

    

    

}
