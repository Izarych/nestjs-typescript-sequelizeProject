import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcryptjs'
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {User} from "../users/users.model";
import {CreateProfileDto} from "../profile/dto/create-profile.dto";
import {ProfileService} from "../profile/profile.service";
import {RegistrationDto} from "./dto/registration.dto";
import {Profile} from "../profile/profile.model";



@Injectable()
export class AuthService {
    constructor(private userService: UsersService,
                private jwtService: JwtService,
                private profileService: ProfileService) {
    }

    // Функция для логина пользователя, см. ValidateUser
    async login(userDto: CreateUserDto){
        const user = await this.validateUser(userDto);
        return user;
    }
    // Регистрируем пользователя
    async registration(dto: RegistrationDto) {
        // Получаем пользователя по почте
        const candidate = await this.userService.getUserByEmail(dto.email);
        // Если пользователь нашелся, значит он уже зарегистрирован, бросаем ошибку
        if (candidate) {
            throw new HttpException('Пользователь с таким E-Mail уже существует', HttpStatus.BAD_REQUEST);

        }
        // Хэшируем пароль с помощью bcrypt
        const hashPassword = await bcrypt.hash(dto.password, 5);
        // Создаем пользователя передавая все аргументы из dto и меняя пароль на захэшированный
        const user = await this.userService.createUser({...dto, password: hashPassword})
        // Создаем профиль пользователя
        const profile = await this.profileService.createProfile(user.id, dto);
        // Возвращаем токен зарегистрированного пользователя
        return this.generateToken(user, profile);
    }

    async registrationAdmin(dto: RegistrationDto) {
        const candidate = await this.userService.getUserByEmail(dto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким E-Mail уже существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userService.createAdmin({...dto, password: hashPassword});
        const profile = await this.profileService.createProfile(user.id, dto);
        return this.generateToken(user, profile);
    }

    private async generateToken(user: User, profile: Profile) {
        // Обозначаем поля которые будут присутствовать в токене
        const payload = {email: user.email, id: user.id, roles: user.roles, profile: profile}
        return {
            // Возвращаем токен с полями обозначенными ранее
            token: this.jwtService.sign(payload)
        }
    }

    // Функция для проверки пользователя, получаем юзера по почте и проверяем совпадают ли захэшированный
    // пароль с паролем из dto
    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный E-Mail или Пароль'})
    }
}
