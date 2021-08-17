import { debug } from "console";
import {Request, Response, Router } from "express";
const router: Router = Router();

import { hashPassword } from "../../password";
import User from '../../entity/User';
import {getRepository, getConnection} from "typeorm";

router.post("/", async(req: Request, res: Response): Promise<Response> => {
    const connection = getConnection("connection1");
    const userRepository = connection.getRepository(User);
    
    // Request Body variables
    const username: string = req.body.username;
    const email: string = req.body.email_addr;
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
    }

    // Response JSON object
    const response: object = {
        isSuccess: isValid,
        user: {
            username,
            email,
        }
    };

    res.status(201);
    return res.json(response);
});

router.put("/:username", async(req: Request, res: Response): Promise<Response> => {
    const connection = getConnection("connection1");
    const userRepository = connection.getRepository(User);

    const username: string = req.body.username || "";
    const email: string = req.body.email_addr || "";
    const password: string = req.body.password || "";
    const profile_picture: string = req.body.profile_picture || "";

    // Request Body validation
    const isValidUsername: boolean = username.length > 0 && username.length <= 255 && typeof username === "string" && !username.includes(" ");
    const isValidEmail: boolean = email.length > 0 && email.length <= 255 && typeof email === "string" && email.includes("@");
    const isValidPassword = password.length > 7 && password.length <= 255 && typeof password === "string";

    const isValid: boolean = isValidUsername && isValidEmail && isValidPassword;

    // TODO: Check picture size conforms to the correct standards.

    let user = await userRepository.findOne({username: req.params.username});

    if (user) {
        if (isValidPassword) {
            const hashArray = hashPassword(password);
            let hash = `${hashArray[0]}|${hashArray[1]}`;
            user.password_hash = hash;
        }

        if (isValidUsername) {
            user.username = username;
        }

        if (isValidEmail) {
            user.email = email;
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
        

    return res.status(201).json({
        isSuccess: true,
        user: {}
    });
});

router.get("/:username", async(req: Request, res: Response): Promise<Response> => {
    const connection = getConnection("connection1");
    const userRepository = connection.getRepository(User);

    let user = await userRepository.findOne({username: req.params.username});
    debug("USER: ", user);

    if (user) {
        res.status(201);
        return res.json({
            "isSuccess": true,
            "user": user
        });
    }

    res.status(201);
    return res.json({
        "isSuccess": false,
        "user": {}
    });
});

export default router;