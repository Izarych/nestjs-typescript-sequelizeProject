import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Profile} from "../profile/profile.model";
import {ProfileModule} from "../profile/profile.module";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      SequelizeModule.forFeature([User, Profile, Role, UserRoles]),
      ProfileModule,
      RolesModule,
      forwardRef(() => AuthModule)
  ],
  exports: [
      UsersService
  ]
})
export class UsersModule {}
