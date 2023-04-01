import {Column, DataType, Model, Table} from "sequelize-typescript";


@Table({tableName: 'files'})
export class File extends Model<File> {
    @Column({type: DataType.INTEGER, autoIncrement:true, primaryKey: true, unique: true})
    id: number;

    @Column({type: DataType.STRING})
    fileName: string;

    @Column({type: DataType.STRING, allowNull: true})
    essenceTable: string;

    @Column({type: DataType.INTEGER, allowNull: true})
    essenceId: number;

}