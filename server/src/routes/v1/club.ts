import { debug, profile } from "console";
import {Request, Response, Router } from "express";
import {getRepository, getConnection, TreeLevelColumn} from "typeorm";

// Entities
import User from '../../entity/User';
import Club, { ClubMember, ClubBulletin, ClubBulletinKeyword } from '../../entity/Club';

const router: Router = Router();

function getBaseUserResponse(user: User) {
    console.log("User...: ", user);

    return {
        id: user.id,
        username: user.username,
        profile_picture: user.profile_picture
    }
}

function getClubResponse(club: Club) {
    console.log("Club...", club);

    return {
        id: club.id,
        uuid: club.uuid,
        name: club.name,
        description: club.description,
        profile_picture: club.profile_picture,
        cover_picture: club.cover_picture,
        is_public: club.is_public,
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
        const is_public = req.body.is_public;

        let club = new Club();
        club.name = name;
        club.description = description;
        club.is_public = is_public || true;

        if (profile_picture !== undefined) {
            club.profile_picture = profile_picture;
        }

        if (cover_picture !== undefined) {
            club.cover_picture = cover_picture;
        }

        club.uuid = generateUuid(); // TODO: Check if uuid has been used.

        club.owner = res.locals.user;
        
        await clubRepository.save(club)
        .then((theClub: Club) => {
            return res.json({
                isSuccess: true,
                club: getClubResponse(theClub)
            });
        })
        .catch(err => {
            debug(err);
            return  res.json({
                isSuccess: false,
                club: {}
            });
        });
    }

    return  res.json({
        isSuccess: false,
        club: {}
    });
});

// Get a club
router.get('/:uuid', async(req: Request, res: Response) => {
    const connection = getConnection("connection1");
    const clubRepository = connection.getRepository(Club);

    const uuid = req.params.uuid;

    const club = await clubRepository.findOne({relations: ["owner"], where: {uuid: uuid}});

    debug("Club: ", club);

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

router.put('/:uuid', async(req: Request, res: Response) => {
    const connection = getConnection("connection1");
    const clubRepository = connection.getRepository(Club);

    if (res.locals.user) {
        const name = req.body.name;
        const description = req.body.description;
        const profile_picture = req.body.profile_picture;
        const cover_picture = req.body.profile_picture;

        const club = await clubRepository.findOne({uuid: req.params.uuid});
        
        if (club !== undefined && club.owner.id === res.locals.user.id) { // TODO: Add OR check for admins
            if (name.length > 0) {
                club.name = name;
            }
    
            if (description.length > 0) {
                club.description = description;
            }
    
            if (profile_picture.length > 0) {
                club.profile_picture = profile_picture;
            }
    
            if (cover_picture.length > 0) {
                club.cover_picture = cover_picture;
            }
            
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
        }
    }

    return  res.json({
        isSuccess: false,
        club: {}
    });
});

router.get('/:uuid/member/:username', async(req: Request, res: Response) => {
    const connection = getConnection("connection1");
    const userRepository = connection.getRepository(User);
    const clubRepository = connection.getRepository(Club);
    const clubMemberRepository = connection.getRepository(ClubMember);

    const user = await userRepository.findOne({username: req.params.username});
    const club = await clubRepository.findOne({relations: ["owner"], where: {uuid: req.params.uuid}});
    const member = await clubMemberRepository.findOne({relations: ["user", "club"], where: {user: user, club: club}});

    debug("===Member===", member);

    if (member !== undefined && user !== undefined && club !== undefined) {
        return res.json({
            isSuccess: true,
            member: {
                id: member.id,
                user: getBaseUserResponse(user),
                club: getClubResponse(club),
                is_admin: member.is_admin,
                is_moderator: member.is_moderator,
                is_member: member.is_member,
                is_requested: member.is_requested
            }
        });
    }

    return res.json({
        isSuccess: false,
        member: {}
    });
});

router.get('/:uuid/member/', async(req: Request, res: Response) => {
    const connection = getConnection("connection1");
    const clubRepository = connection.getRepository(Club);
    const clubMemberRepository = connection.getRepository(ClubMember);

    const club = await clubRepository.findOne({uuid: req.params.uuid});

    if (club !== undefined) {
        const members = await clubMemberRepository.find({club: club});
        const sanitisedMembers: any = [];
        
        members.forEach((member: ClubMember) => {
            sanitisedMembers.push(getClubMemberResponse(member));
        });

        return res.json({
            isSuccess: true,
            members: sanitisedMembers
        });
    }

    return res.json({
        isSuccess: false,
        members: []
    });
});

router.post('/:uuid/member/', async(req: Request, res: Response) => {
    const connection = getConnection("connection1");
    const clubRepository = connection.getRepository(Club);
    const clubMemberRepository = connection.getRepository(ClubMember);

    const isAdmin = req.body.isAdmin || false;
    const isMod = req.body.isModerator || false;

    const club = await clubRepository.findOne({uuid: req.params.uuid});

    const memberCheck = await clubMemberRepository.findOne({user: res.locals.user, club: club});

    if (memberCheck === undefined) {
        let isMember: boolean;
        let isRequested: boolean;

        if (club !== undefined) {
            if (club.is_public) {
                isMember = true; // TODO: Check club privacy...
                isRequested = false;
            } else {
                isMember = false;
                isRequested = true;
            }
        
            const member = new ClubMember();

            member.is_admin = isAdmin;
            member.is_moderator = isMod;
            member.is_member = isMember;
            member.is_requested = isRequested;
            member.club = club;
            member.user = res.locals.user;

            await clubMemberRepository.save(member);

            return res.json({
                isSuccess: true,
                member: getClubMemberResponse(member)
            });
        }
    }

    return res.json({
        isSuccess: false,
        member: {}
    })
});

router.put('/:uuid/member/:id', async(req: Request, res: Response) => {
    const connection = getConnection("connection1");
    const clubRepository = connection.getRepository(Club);
    const clubMemberRepository = connection.getRepository(ClubMember);

    const club = await clubRepository.findOne({uuid: req.params.uuid});

    if (club !== undefined) {
        if (res.locals.user.id === club.owner.id) {
            const isAdmin = req.body.isAdmin;
            const isModerator = req.body.isModerator;
            const isMember = req.body.isMember;
            const isRequested = req.body.isRequested;

            const member = await clubMemberRepository.findOne({id: Number.apply(req.params.id)});

            if (member !== undefined) {
                if (isAdmin !== undefined || isAdmin !== null) {
                    member.is_admin = isAdmin;
                }

                if (isModerator !== undefined || isModerator !== null) {
                    member.is_moderator = isModerator;
                }

                if (isMember !== undefined || isMember !== null) {
                    member.is_member = isMember;
                }

                if (isRequested !== undefined || isRequested !== null) {
                    member.is_requested = isRequested;
                }

                return res.json({
                    isSuccess: true,
                    member: getClubMemberResponse(member)
                });
            }
        }
    }

    return res.json({
        isSuccess: false,
        member: {}
    });
});

// TODO: Add Club Bulletin REQUESTS.
// TODO: Find a default Cover image for Clubs.

export default router;