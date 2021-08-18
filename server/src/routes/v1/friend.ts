import { debug } from "console";
import {Request, Response, Router } from "express";

import { hashPassword } from "../../password";
import {getRepository, getConnection, TreeLevelColumn} from "typeorm";

// Entities
import User from '../../entity/User';
import Friend, {FriendStatus, FriendRequestStatus} from '../../entity/Friend';

const router: Router = Router();

// TODO: Support removing friends.

// Send a Friend Request
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
                friend: friend
            });
        }

        // Friend record already exists
        return res.status(201).json({
            isSuccess: false,
            friend: friendCheck
        });
    }

    // Recipient or Sender not defined.
    return res.status(201).json({
        isSuccess: false,
        friend: {}
    });
});

router.put('/accept', async(req: Request, res: Response): Promise<Response> => {
    const senderUsername = req.body.senderUsername;
    
    const connection = getConnection('connection1');
    const userRepository = connection.getRepository(User);
    const friendRespository = connection.getRepository(Friend);

    const sender = await userRepository.findOne({username: senderUsername});
    let friend = await friendRespository.findOne({recipient: res.locals.user, sender: sender});

    if (friend) {
        if (friend.friend_request_status === FriendRequestStatus.REQUESTED) {
            friend.friend_request_status = FriendRequestStatus.ACCEPTED;
            friend.friend_status = FriendStatus.FRIENDS;

            await friendRespository.save(friend);

            return res.status(201).json({
                isSuccess: true,
                friend: friend
            });
        }
    }

    return res.status(201).json({
        isSuccess: false,
        friend: {}
    });
});

router.put('/decline', async(req: Request, res: Response): Promise<Response> => {
    const senderUsername = req.body.senderUsername;
    
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
                friend: friend
            });
        }
    }

    return res.status(201).json({
        isSuccess: false,
        friend: {}
    });
});

router.get('/', async(req: Request, res: Response): Promise<Response> => {

    const username = req.body.username;

    const connection = getConnection('connection1');
    const userRepository = connection.getRepository(User);
    const friendRespository = connection.getRepository(Friend);

    const user = await userRepository.findOne({username: username});

    if (user) {
        let friend = await friendRespository.findOne({sender: res.locals.user, recipient: user});

        if (friend) {
            friend = await friendRespository.findOne({sender: user, recipient: res.locals.user});
        }

        if (friend) {
            return res.status(201).json({
                isSuccess: true,
                friend: friend
            });
        }
    }

    return res.status(201).json({
        isSuccess: false,
        friend: {}
    });
});

export default router;