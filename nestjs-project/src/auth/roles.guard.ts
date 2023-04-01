import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";


// Создаем гвард проверки ролей
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private reflector: Reflector) {
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            // Получаем все роли используя reflector (он ищет аннотацию ROLES_KEY на методе контроллера
            // который обрабатывает запрос если он есть, а затем ищет её на классе контроллера
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ])
            // Если ролей нет - true
            if (!requiredRoles) {
                return true;
            }
            // Получаем реквест и хедеры из которых тянем токен и предъявителя токена
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
            if (bearer !== 'Bearer' || !token) {
                // Бросаем ошибку если токена или предъявителя нет
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }
            // Возвращаем юзера в виде объекта который содержит все поля токена
            const user = this.jwtService.verify(token);
            const id = req.params.id;
            req.user = user;
            // Добавляем условие, если у пользователя есть роль которая есть в ролях гварда и айдишник профиля
            // совпадает с  айдишником реквеста то возвращаем true
            if (requiredRoles.includes(user.roles[0].value) && user.profile.id === Number(id)) {
                return true;
            }
            // Еще одно условие для роли админа, если у юзера есть роль Админ и в гвард ролей передан админ, то true
            else if (user.roles[0].value.includes('ADMIN') && requiredRoles.includes('ADMIN')) {
                return true;
            }
            return false;
        } catch(e) {
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
        }
    }
}