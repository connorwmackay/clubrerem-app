import { debug } from "console";
import {Request, Response, Router } from "express";
import {getRepository, getConnection, TreeLevelColumn} from "typeorm";

// Entities
import User from '../../entity/User';
import Club, { ClubMember, ClubBulletin, ClubBulletinKeyword } from '../../entity/Club';

const router: Router = Router();

function getBaseUserResponse(user: User) {
    return {
        id: user.id,
        username: user.username,
        profile_picture: user.profile_picture
    }
}

function getClubResponse(club: Club) {
    return {
        id: club.id,
        uuid: club.uuid,
        name: club.name,
        description: club.description,
        profile_picture: club.profile_picture,
        cover_picture: club.cover_picture,
        owner: getBaseUserResponse(club.owner)
    }
}

function getClubMemberResponse(member: ClubMember) {
    return {
        id: member.id,
        user: getBaseUserResponse(member.user),
        club: getClubResponse(member.club),
        is_admin: member.is_admin,
        is_moderator: member.is_moderator,
        is_member: member.is_member,
        is_requested: member.is_requested
    }
}

function getClubBulletinResponse(bulletin: ClubBulletin) {
    return {
        id: bulletin.id,
        author: getClubMemberResponse(bulletin.author),
        club: getClubResponse(bulletin.club),
        title: bulletin.title,
        content: bulletin.content
    }
}

function getClubBulletinKeywordResponse(bulletinKeyword: ClubBulletinKeyword) {
    return {
        id: bulletinKeyword.id,
        keyword: bulletinKeyword.keyword,
        author: getClubMemberResponse(bulletinKeyword.author),
        bulletin: getClubBulletinResponse(bulletinKeyword.bulletin)
    }
}

export default router;