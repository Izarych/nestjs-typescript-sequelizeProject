import {Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FilesService} from "./files.service";


@Controller('files')
export class FilesController {
    constructor(private fileService: FilesService) {
    }

    @Get()
    getAll() {
        return this.fileService.getAllFiles();
    }

    @Delete('/old')
    delete() {
        return this.fileService.deleteOldFiles();
    }


}
