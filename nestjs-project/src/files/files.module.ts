import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {File} from "./files.model";


@Module({
  providers: [FilesService],
  controllers: [FilesController],
  imports: [
      SequelizeModule.forFeature([File])

  ],
  exports: [
      FilesService
  ]
})
export class FilesModule {}
