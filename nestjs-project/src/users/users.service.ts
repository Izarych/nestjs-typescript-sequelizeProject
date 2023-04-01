import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./users.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {Profile} from "../profile/profile.model";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User,
                @InjectModel(Profile) private profileRepository: typeof Profile,
                private roleServices: RolesService) {
    }

    async createAdmin(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        const role = await this.roleServices.getRoleByValue("ADMIN");
        await user.$set('roles', [role.id]);
        user.roles = [role];
        const profile = await this.profileRepository.findOne({where: {userId: user.id}});
        await user.$set('profile', profile)
        return this.userRepository.findByPk(user.id, {include: {all: true}})
    }

    async createUser(dto: CreateUserDto) {
        // Создаем пользователя в БД
        const user = await this.userRepository.create(dto);
        // Даем роль пользователю
        const role = await this.roleServices.getRoleByValue("USER");
        await user.$set('roles', [role.id]);
        user.roles = [role];
        const profile = await this.profileRepository.findOne({where: {userId: user.id}})
        // Обновляем запись юзера в БД, связывая ее с профилем
        await user.$set('profile', profile);
        // Возвращаем созданную запись юзера
        return this.userRepository.findByPk(user.id, {include: {all: true}});
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        return user
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleServices.getRoleByValue(dto.value);
        if (role && user) {
            await user.$add('role', role.id);
            return dto;
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }

    async ban(dto: BanUserDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }
        user.banned = true;
        user.banReason = dto.banReason;
        await user.save();
        return user;
    }
}
