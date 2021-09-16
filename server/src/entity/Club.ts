import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import User from './User';

@Entity()
export default class Club {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    uuid: string; // This is the Unique URL ID

    @Column()
    name: string;

    @Column({default: 'A club in ReRem'})
    description: string;

    @Column({default: '/res/images/default_profile.png'})
    profile_picture: string;

    @Column({default: '/res/images/default_cover.png'})
    cover_picture: string;

    @Column({default: true})
    is_public: true;

    @ManyToOne(() => User, user => user.id)
    owner: User;
}

@Entity()
export class ClubMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id)
    user: User;

    @ManyToOne(() => Club, club => club.id)
    club: Club;

    @Column({default: false})
    is_admin: boolean;

    @Column({default: false})
    is_moderator: boolean;

    @Column({default: true})
    is_member: boolean;

    @Column({default: false})
    is_requested: boolean;
}

@Entity()
export class ClubBulletin {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ClubMember, member => member.id)
    author: ClubMember;

    @ManyToOne(() => Club, club => club.id)
    club: Club;

    @Column()
    title: string;

    @Column()
    content: string;
}

@Entity()
export class ClubBulletinKeyword {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    keyword: string;

    @ManyToOne(() => ClubMember, member => member.id)
    author: ClubMember;

    @ManyToOne(() => ClubBulletin, bulletin => bulletin.id)
    bulletin: ClubBulletin;
}