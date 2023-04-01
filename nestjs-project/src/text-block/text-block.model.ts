import {Column, DataType, Model, Table} from "sequelize-typescript";



@Table({tableName: 'textBlock'})
export class TextBlock extends Model<TextBlock> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement:true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING,unique: true, allowNull: false})
    searchName: string;

    @Column({type: DataType.STRING })
    name: string;

    @Column({type: DataType.STRING})
    image: string;

    @Column({type: DataType.STRING, allowNull: true})
    text: string;

    @Column({type: DataType.STRING, allowNull:true})
    group: string;
}