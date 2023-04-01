import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {RegistrationDto} from "./dto/registration.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }
    // Post метод с ендпоинтом для логина
    @Post('/login')
    login(@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto);
    }

    // Post метод с ендпоинтом для регистрации админа
    @Post('/registrationAdmin')
    registrationAdmin(@Body() dto: RegistrationDto) {
        return this.authService.registrationAdmin(dto);
    }

    // Post метод с ендпоинтом для регистрации обычного пользователя
    @Post('/registration')
    registration(@Body() dto: RegistrationDto) {
        return this.authService.registration(dto);
    }
}
