import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { menuImports } from './menu/providers';
import { RestaurantImports } from './restaurant/restaurantProviders';
import { AuthGuard } from './middlewares/auth.middleware';
import { AxiosService } from './axios/axios';


@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'postgres',
        host:'localhost',
        port: 5434,
        username:'postgres',
        password: 'postgres',
        database:'restaurant',
        autoLoadEntities: true,
        synchronize: true,
    }),
    TypeOrmModule.forFeature([...menuImports.entities,...RestaurantImports.entities])
  ],
  controllers: [AppController,...RestaurantImports.controllers,...menuImports.controllers],
  providers: [AuthGuard,AxiosService,AppService,...RestaurantImports.providers,...menuImports.providers],
})
export class AppModule {}
