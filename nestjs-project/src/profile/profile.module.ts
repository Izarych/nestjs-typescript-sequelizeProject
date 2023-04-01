import {forwardRef, Module} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import {User} from "../users/users.model";
import {UserRoles} from "../roles/user-roles.model";
import {Role} from "../roles/roles.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  providers: [ProfileService],
  controllers: [ProfileController],
  imports: [
      // Регистрируем модели User и Profile, так как они используются в контроллерах/сервисах этого модуля
      SequelizeModule.forFeature([User, Profile]),
      forwardRef(()=> AuthModule)
  ],
  exports: [
      ProfileService
  ]
})
export class ProfileModule {}
