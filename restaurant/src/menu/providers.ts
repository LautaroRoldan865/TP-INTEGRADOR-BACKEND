import { MenuController } from "./menu.controller";
import { MenuService } from "./menu.service";
import { MenuEntity } from "src/entities/menu.entity";

export const menuImports={
    controllers: [MenuController],
    providers: [MenuService],
    entities:[MenuEntity]
}