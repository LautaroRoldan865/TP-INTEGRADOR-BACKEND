import { RolController } from "./rol.controller";
import { RolEntity } from "src/entities/rol.entity";
import { RolService } from "./rol.service";
import { PermissionService } from "src/permission/permission.service";
import { UserEntity } from "src/entities/user.entity";
import { PermissionEntity } from "src/entities/permision.entity";
export declare const RolImports: {
    controllers: (typeof RolController)[];
    providers: (typeof RolService | typeof PermissionService)[];
    entities: (typeof UserEntity | typeof RolEntity | typeof PermissionEntity)[];
};
