import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {File} from "./files.model";
import * as fs from 'fs';
import * as path from 'path'
import * as uuid from 'uuid'
import {Op} from "sequelize";

@Injectable()
export class FilesService {
    constructor(@InjectModel(File) private fileRepository: typeof File) {
    }

    // Функция сохранения файла
    async createFile(file): Promise<string> {
        try {
            // Создаем имя файла с помощью uuid
            const fileName = uuid.v4() + '.jpg';
            // Создаем путь
            const filePath = path.resolve(__dirname, '..', 'static')
            // Если папки по такому пути нет, создаем папку
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})
            }
            // Записываем файл
            fs.writeFileSync(path.join(filePath, fileName), file.buffer)
            // Возвращаем имя файла которое будем записывать в БД
            return fileName;
        } catch(e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async addFileToDB(fileName: string, essenceTable: string, essenceId: number) {
        // Создаем запись в БД с именем файла, в какой таблице он используется и её айдишник
        return await this.fileRepository.create({
            fileName: fileName,
            essenceTable: essenceTable,
            essenceId: essenceId
        })
    }

    async getAllFiles() {
        return this.fileRepository.findAll();
    }

    async clearEssence(essenceId: number) {
        // Если удаляется таблица в которой использовался файл, ставим, что он нигде не используется
        const file = await this.fileRepository.findOne({where: {essenceId: essenceId}})
        return await file.update({
            essenceTable: null,
            essenceId: null
        })

    }

    async deleteOldFiles() {
        // Удаляем ненужные файлы из БД и из static которые были созданы более часа назад и нигде не используются
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const oldFiles = await this.fileRepository.findAll({where: {essenceId: null, essenceTable: null,
                createdAt: {
                    [Op.lt]: oneHourAgo
                }}})
        const fileNames = oldFiles.map(file => file.dataValues.fileName);
        for (let i = 0; i < fileNames.length; i++) {
            let filePath = path.join(__dirname, '..', 'static', fileNames[i])
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await this.fileRepository.destroy({where: {essenceId: null, essenceTable: null,
            createdAt: {
            [Op.lt]: oneHourAgo
            }}})
        return {
            message: 'Неиспользуемые файлы были успешно удалены'
        }
    }
}
