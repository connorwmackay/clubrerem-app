
import Express from 'express'
import User from '../../entity/User'
import Friend from '../../entity/Friend'
import {ILike, getRepository, getConnection} from "typeorm";
import { debug } from 'winston';
import Club from '../../entity/Club';

const router = Express.Router();

// TODO: Create a types.ts file that exports all the types.

/*
 * This is how every route ts file should be structured. There should be types for the response...
 */

interface SanitisedUser {
    username: string;
    description: string;
    profile_picture: string;
    // TODO: Add an isFriend boolean field that can be null. This should check if the authenticated user is friends with this user. This should return null if there isn't an authenticated user.
}

interface SanitisedClub {
    name: string;
    uuid: string;
    profile_picture: string;
}

interface FindSuccessResponse {
    is_success: boolean;
    is_authenticated: boolean;
    is_valid_search_query: boolean;
}

interface FindResponse {
    success: FindSuccessResponse,
    users: SanitisedUser[],
    clubs: SanitisedClub[]
}

const defaultFindResponse: FindResponse = {
    success: {
        is_success: true,
        is_authenticated: false,
        is_valid_search_query: false
    },
    users: [],
    clubs: []
}

router.get('/:query', async(req: Express.Request, res: Express.Response) => {
    const connection = getConnection("connection1");
    const userRepository = connection.getRepository(User);
    const clubRepository = connection.getRepository(Club);
    const findResponse: FindResponse = defaultFindResponse;
    
    const query = req.params.query;
    const isValidQuery = typeof query === 'string' && query.length > 0 && query !== ' ';

    findResponse.success.is_valid_search_query = isValidQuery;

    const users = await userRepository.find({username: ILike(`${query}%`)});
    const clubs = await clubRepository.find({name: ILike(`${query}%`)});

    const sanitisedUsers: SanitisedUser[] = [];
    const sanitisedClubs: SanitisedClub[] = [];
    
    // Remove sensitive information from response.
    users.forEach(user => {
        sanitisedUsers.push({
            username: user.username,
            description: user.description,
            profile_picture: user.profile_picture
        });
    });

    clubs.forEach((club: Club) => {
        sanitisedClubs.push({
            name: club.name,
            uuid: club.uuid,
            profile_picture: club.profile_picture
        });
    });

    findResponse.users = sanitisedUsers;
    findResponse.clubs = sanitisedClubs;

    if (res.locals.user) {
        findResponse.success.is_authenticated = true;
    }

    return res.json(findResponse);
});

export default router;