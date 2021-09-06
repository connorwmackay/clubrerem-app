import { debug } from "console";
import {Request, Response, Router } from "express";
import {getRepository, getConnection, TreeLevelColumn} from "typeorm";

// Entities
import User from '../../entity/User';
import Friend, {FriendStatus, FriendRequestStatus} from '../../entity/Friend';

const router: Router = Router();

function getFriendResponse(friend: Friend): {} {
    return {
        id: friend.id,
        friend_requests_status: friend.friend_request_status,
        friend_status: friend.friend_status,
        sender: {
            id: friend.sender.id,
            username: friend.sender.username,
            profile_picture: friend.sender.profile_picture
        },
        recipient: {
            id: friend.recipient.id,
            username: friend.recipient.username,
            profile_picture: friend.recipient.profile_picture
        }
    }
}

// TODO: Support removing friends.

// Send a Friend Request and create a new friend record.
router.post('/', async(req: Request, res: Response): Promise<Response> => {

    const connection = getConnection('connection1');
    const userRepository = connection.getRepository(User);
    const friendRespository = connection.getRepository(Friend);

    const recipientUsername = req.body.recipientUsername;
    const recipient = await userRepository.findOne({username: recipientUsername});

    if (res.locals.user && recipient) {
        const friendCheck = await friendRespository.findOne({recipient: recipient, sender: res.locals.user});

        if (!friendCheck) {
            let friend = new Friend();
            friend.recipient = recipient;
            friend.sender = res.locals.user.id;

            await friendRespository.save(friend);

            // Created new friend record
            return res.status(201).json({
                isSuccess: true,
                friend: getFriendResponse(friend)
            });
        }

        // Friend record already exists
        return res.status(201).json({
            isSuccess: false,
            friend: getFriendResponse(friendCheck)
        });
    }

    // Recipient or Sender not defined.
    return res.status(201).json({
        isSuccess: false,
        friend: {}
    });
});

// Accept a friend request and update the friend record.
router.get('/:username/accept', async(req: Request, res: Response): Promise<Response> => {
    const senderUsername = req.params.username;
    
    const connection = getConnection('connection1');
    const userRepository = connection.getRepository(User);
    const friendRespository = connection.getRepository(Friend);

    const sender = await userRepository.findOne({username: senderUsername});
    let friend = await friendRespository.findOne({relations: ["sender", "recipient"], where: {recipient: res.locals.user, sender: sender}});

    if (friend) {
        if (friend.friend_request_status === FriendRequestStatus.REQUESTED) {
            friend.friend_request_status = FriendRequestStatus.ACCEPTED;
            friend.friend_status = FriendStatus.FRIENDS;

            await friendRespository.save(friend);

            return res.status(201).json({
                isSuccess: true,
                friend: getFriendResponse(friend)
            });
        }
    }

    return res.status(201).json({
        isSuccess: false,
        friend: {}
    });
});

// Decline a friend request and update the friend record.
router.get('/:username/decline', async(req: Request, res: Response): Promise<Response> => {
    const senderUsername = req.params.username;
    
    const connection = getConnection('connection1');
    const userRepository = connection.getRepository(User);
    const friendRespository = connection.getRepository(Friend);

    const sender = await userRepository.findOne({username: senderUsername});
    let friend = await friendRespository.findOne({recipient: res.locals.user, sender: sender});

    if (friend) {
        if (friend.friend_request_status === FriendRequestStatus.REQUESTED) {
            friend.friend_request_status = FriendRequestStatus.DECLINED;
            friend.friend_status = FriendStatus.NOT_FRIENDS;

            await friendRespository.save(friend);

            return res.status(201).json({
                isSuccess: true,
                friend: getFriendResponse(friend)
            });
        }
    }

    return res.status(201).json({
        isSuccess: false,
        friend: {}
    });
});

// Get the Friend list of the authenticated user.
router.get('/', async(req: Request, res: Response): Promise<Response> => {
    const connection = getConnection('connection1');
    const friendRespository = connection.getRepository(Friend);

    let friends: Friend[] = [];
    const friends_set_one = await friendRespository.find({relations: ["sender", "recipient"], where: {sender: res.locals.user}});
    const friends_set_two = await friendRespository.find({relations: ["sender", "recipient"], where: {recipient: res.locals.user}});

    if (friends_set_one.length > 0 && friends_set_two.length > 0) {
        friends = friends.concat(friends_set_one, friends_set_two);
    } else if(friends_set_one.length > 0) {
        friends = friends.concat(friends_set_one);
    } else if(friends_set_two.length > 0) {
        friends = friends.concat(friends_set_two);
    }

    if (friends) {

        for (let i=0; i < friends.length; i++) {
            if (friends[i].friend_status !== FriendStatus.FRIENDS) {
                friends.splice(i, 1);
            }
        }

        let formatFriends: Array<{}> = [];
        friends.forEach(friend => formatFriends.push(getFriendResponse(friend)));

        return res.status(201).json({
            isSuccess: true,
            friends: formatFriends
        });
    }

    return res.status(201).json({
        isSuccess: false,
        friends: []
    });
});

// Get a Friend record of a specific user connected to the authenticated user.
router.get('/:username', async(req: Request, res: Response): Promise<Response> => {

    const username = req.params.username || '';

    const connection = getConnection('connection1');
    const userRepository = connection.getRepository(User);
    const friendRespository = connection.getRepository(Friend);

    const user = await userRepository.findOne({username: username});

    if (user) {
        let friend = await friendRespository.findOne({relations: ["sender", "recipient"], where: {sender: res.locals.user, recipient: user}});

        if (!friend) {
            friend = await friendRespository.findOne({relations: ["sender", "recipient"], where: {sender: user, recipient: res.locals.user}});
        }

        if (friend) {
            return res.status(201).json({
                isSuccess: true,
                friend: getFriendResponse(friend)
            });
        } else {
            return res.status(201).json({
                isSuccess: true,
                friend: {
                    friend_status: FriendStatus.NOT_FRIENDS,
                    friend_request_status: FriendRequestStatus.DECLINED
                }
            });
        }
    }
    return res.status(201).json({
        isSuccess: false,
        friend: {}
    });
});

export default router;