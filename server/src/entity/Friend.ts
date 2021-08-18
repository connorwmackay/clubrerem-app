import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import User from './User';

export enum FriendRequestStatus {
    ACCEPTED,
    REQUESTED,
    DECLINED,
};

export enum FriendStatus {
    FRIENDS,
    NOT_FRIENDS,
};

@Entity()
export default class Friend {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id)
    sender: User;

    @ManyToOne(() => User, user => user.id)
    recipient: User;

    @Column({type: 'enum',
            enum: FriendRequestStatus,
            default: FriendRequestStatus.REQUESTED 
        })
    friend_request_status: FriendRequestStatus;

    @Column({type: 'enum',
            enum: FriendStatus,
            default: FriendStatus.NOT_FRIENDS})
    friend_status: FriendStatus
}