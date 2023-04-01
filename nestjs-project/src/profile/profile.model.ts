import {BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";


// Таблица профиль. При регистрации пользователя профиль создается автоматически
@Table({tableName: 'profile'})
export class Profile extends Model<Profile> {
    @Column({type: DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id: number;

    @Column({type: DataType.STRING, unique:false, allowNull: false})
    fullName: string;

    @Column({type: DataType.STRING, unique: true, allowNull: true})
    phone: string;

    @Column({type: DataType.STRING, allowNull: false})
    email:string;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User
}