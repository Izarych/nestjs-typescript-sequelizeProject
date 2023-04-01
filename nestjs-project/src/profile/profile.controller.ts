import {Body, Controller, Delete, Param, Put, UseGuards} from '@nestjs/common';
import {ProfileService} from "./profile.service";
import {Profile} from "./profile.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";


@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {
    }

    // Метод PUT для обновления данных пользователя + профиля которым могут воспользоваться либо админ
    // либо юзер которому принадлежит профиль
    @Roles("ADMIN","USER")
    @UseGuards(RolesGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateDto: Partial<Profile>) {
        return this.profileService.updateProfile(id, updateDto);
    }

    // Метод DELETE для удаления пользователя + профиля которым могут воспользоваться либо админ
    // либо юзер которому принадлежит профиль
    @Roles("ADMIN","USER")
    @UseGuards(RolesGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.profileService.deleteProfile(id);
    }
}
