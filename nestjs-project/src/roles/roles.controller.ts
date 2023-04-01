import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create-role.dto";

@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) {
    }

    // Метод POST для создания ролей
    @Post()
    create(@Body() dto: CreateRoleDto){
        return this.roleService.createRole(dto)
    }

    // Метод GET для получения роли по value
    @Get('/:value')
    getByValue(@Param('value') value: string) {
        return this.roleService.getRoleByValue(value);
    }
}
