import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import User from './User';

export enum AuthLevel {
    ADMIN,
    USER,
    GUEST
};

@Entity()
export default class Auth {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id, {nullable: true})
    user: User

    @Column({unique: true})
    bearer_token: string;

    @Column({
        type: "enum",
        enum: AuthLevel,
        default: AuthLevel.GUEST
    })
    level: AuthLevel
};