import { debug } from "console";
import {Request, Response, Router } from "express";
const router: Router = Router();

import { hashPassword } from "../../password";
import User from '../../entity/User';
import {getRepository, getConnection} from "typeorm";


interface FullUser {
    id: number;
    username: string;
    description: string;
    email: string;
    profile_picture: string;
    password_hash: string;
}

interface SafeUser {
    id: number;
    username: string;
    description: string;
    profile_picture: string;
}
interface UserResponse {
    isSuccess: boolean;
    user: FullUser | SafeUser | {};
}

router.post("/", async(req: Request, res: Response): Promise<Response> => {
    const connection = getConnection("connection1");
    const userRepository = connection.getRepository(User);

    if (!res.locals.user) {
        // Request Body variables
        const username: string = req.body.username;
        const email: string = req.body.email;
        const password: string = req.body.password;

        // Request Body validation
        const isValidUsername: boolean = username.length > 0 && username.length <= 255 && typeof username === "string" && !username.includes(" ");
        const isValidEmail: boolean = email.length > 0 && email.length <= 255 && typeof email === "string" && email.includes("@");
        const isValidPassword = password.length > 7 && password.length <= 255 && typeof password === "string";

        const isValid: boolean = isValidUsername && isValidEmail && isValidPassword;

        if (isValid) {
            const hashArray = hashPassword(password);
            let hash = `${hashArray[0]}|${hashArray[1]}`;
            let user = new User();
            user.username = username;
            user.email = email;
            user.password_hash = hash;
            await userRepository.save(user);
            res.status(201);

            let fullUser: FullUser = {
                id: user.id,
                username: user.username,
                description: user.description,
                email: user.email,
                profile_picture: user.profile_picture,
                password_hash: user.password_hash
            }

            const response: UserResponse = {
                isSuccess: true,
                user: fullUser
            }      

            return res.json(response);
        }
    }

    res.status(201);

    let response: UserResponse = {
        isSuccess: true,
        user: {}
    }

    return res.json(response);
});

router.put("/:username", async(req: Request, res: Response): Promise<Response> => {
    const connection = getConnection("connection1");
    const userRepository = connection.getRepository(User);

    const username: string = req.body.username || "";
    const email: string = req.body.email_addr || "";
    const description: string = req.body.description || "";
    const password: string = req.body.password || "";
    const profile_picture: string = req.body.profile_picture || "";

    // Request Body validation
    const isValidUsername: boolean = username.length > 0 && username.length <= 255 && typeof username === "string" && !username.includes(" ");
    const isValidDescription: boolean = description.length > 0 && description.length <= 512 && typeof description === "string"
    const isValidEmail: boolean = email.length > 0 && email.length <= 255 && typeof email === "string" && email.includes("@");
    const isValidPassword = password.length > 7 && password.length <= 255 && typeof password === "string";

    const isValid: boolean = isValidUsername && isValidEmail && isValidPassword;

    // TODO: Check picture size conforms to the correct standards.

    let user = await userRepository.findOne({username: req.params.username});

    if (res.locals.user && user) {
        if (res.locals.user.id === user.id) {
            if (isValidPassword) {
                const hashArray = hashPassword(password);
                let hash = `${hashArray[0]}|${hashArray[1]}`;
                user.password_hash = hash;
            }

            if (isValidUsername) {
                const usernameCheck = await userRepository.findOne({username: username});
                debug("Username Check: ", usernameCheck);

                if (!usernameCheck && usernameCheck === undefined) {
                    user.username = username;
                }
            }

            if (isValidEmail) {
                const emailCheck = await userRepository.findOne({email: email});

                if (!emailCheck && emailCheck === undefined) {
                    user.email = email;
                }
            }

            if (isValidDescription) {
                user.description = description;
            }

            if (profile_picture.length > 0) {
                user.profile_picture = profile_picture;
            }

            await userRepository.save(user);

            return res.status(201).json({
                isSuccess: true,
                user: user
            });
        }
    }

    return res.status(201).json({
        isSuccess: true,
        user: {}
    });
});

router.get("/:username", async(req: Request, res: Response): Promise<Response> => {
    const connection = getConnection("connection1");
    const userRepository = connection.getRepository(User);

    let user = await userRepository.findOne({username: req.params.username});

    if (user) {
        res.status(201);

        if (res.locals.user !== undefined) {
            if (res.locals.user.id === user.id) {
                return res.json({
                    "isSuccess": true,
                    "user": user
                });
            }
        }
        
        return res.json({
            "isSuccess": true,
            "user": {
                id: user.id,
                username: user.username,
                description: user.description,
                profilePicture: user.profile_picture,
            }
        });
    }

    res.status(201);
    return res.json({
        "isSuccess": false,
        "user": {}
    });
});

export default router;