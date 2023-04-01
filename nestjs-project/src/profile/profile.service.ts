import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import {User} from "../users/users.model";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {RegistrationDto} from "../auth/dto/registration.dto";
import {CreateProfileDto} from "./dto/create-profile.dto";

@Injectable()
export class ProfileService {
    constructor(@InjectModel(Profile) private profileRepository: typeof Profile,
                @InjectModel(User) private userRepository: typeof User) {

    }

    async createProfile(id: number, dto: CreateProfileDto) {
        const user = await this.userRepository.findByPk(id);
        const profile = await this.profileRepository.create({...dto, userId: user.id});
        return profile;
    }

    async updateProfile(id: string, updateDto: Partial<Profile>) {
        const profile =  await this.profileRepository.findByPk(id);
        if (!profile) {
            throw new NotFoundException(`Профиль с id: ${id} не найден`)
        }
        await profile.update(updateDto);
        return profile;
    }

    async deleteProfile(id: string): Promise<{message: string}> {
        const profile = await this.profileRepository.findByPk(id);
        const user = await this.userRepository.findByPk(profile.userId);
        if (!profile) {
            throw new NotFoundException(`Профиль с id: ${id} не найден`)
        }
        await profile.destroy();
        await user.destroy();
        return {message: `Профиль с Id: ${id} и Пользователь с Id: ${profile.userId} были удалены`}
    }

}
