import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column({default: 'Clubbing in ReRem'})
    description: string;

    @Column({unique: true})
    email: string;

    @Column({default: '/res/images/default_profile.png'})
    profile_picture: string;

    @Column()
    password_hash: string;
};