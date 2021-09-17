import { debug, profile } from "console";
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

function generateUuid() {
    const size = 16;
    let uuid = "";

    for (let i=0; i < size; i++) {
        const randNum1 = Math.floor(Math.random() * 16);
        const randNum2 = Math.floor(Math.random() * 16);

        uuid += randNum1.toString(16);
        uuid += randNum2.toString(16);
    }

    return uuid;
}

// Create a club
router.post('/', async(req: Request, res: Response) => {
    const connection = getConnection("connection1");
    const clubRepository = connection.getRepository(Club);

    if (res.locals.user) {
        const name = req.body.name;
        const description = req.body.description;
        const profile_picture = req.body.profile_picture;
        const cover_picture = req.body.profile_picture;

        let club = new Club();
        club.name = name;
        club.description = description;

        if (profile_picture.length > 0) {
            club.profile_picture = profile_picture;
        }

        if (cover_picture.length > 0) {
            club.cover_picture = cover_picture;
        }

        club.uuid = generateUuid(); // TODO: Check if uuid has been used.
        
        await clubRepository.save(club)
        .then((club: Club) => {
            return  res.json({
                isSuccess: true,
                club: getClubResponse(club)
            });
        })
        .catch(err => {
            debug(err);
            return  res.json({
                isSuccess: false,
                club: {}
            });
        });
    } else {
        return  res.json({
            isSuccess: false,
            club: {}
        });
    }
});

// Get a club
router.get('/:uuid', async(req: Request, res: Response) => {
    const connection = getConnection("connection1");
    const clubRepository = connection.getRepository(Club);

    const uuid = req.params.uuid;

    const club = await clubRepository.findOne({uuid: uuid});

    if (club !== undefined) {
        return res.json({
            isSuccess: true,
            club: getClubResponse(club)
        });
    } else {
        return  res.json({
            isSuccess: false,
            club: {}
        });
    }
});

export default router;