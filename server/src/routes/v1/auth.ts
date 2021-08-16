import { debug } from "console";
import {Request, Response, Router } from "express";
const router: Router = Router();

import { hashPassword } from "../../password";
import User from '../../entity/User';
import Auth, { AuthLevel } from "../../entity/Auth";
import {getRepository, getConnection} from "typeorm";
import CryptoJS from "crypto-js";


router.get("/", async(req: Request, res: Response): Promise<Response> => {
    const connection = getConnection("connection1");
    const userRepository = connection.getRepository(User);
    const authRepository = connection.getRepository(Auth);

    const username = req.body.username;
    const password = req.body.password;

    const isValidUsername: boolean = username.length > 0 && username.length <= 255 && typeof username === "string" && !username.includes(" ");
    const isValidPassword = password.length > 7 && password.length <= 255 && typeof password === "string";

    const isValid = isValidUsername && isValidPassword;

    if (isValid) {
        let user = await userRepository.findOne({username: username});

        if (user) {
            const userPasswordHash = user.password_hash.split('|');
            const hash = hashPassword(password, userPasswordHash[1]);

            if(userPasswordHash[0].trim() === hash[0].trim()) {
                let bearerToken = "Bearer " + CryptoJS.lib.WordArray.random(512 / 8).toString(CryptoJS.enc.Hex);
                
                const auth = new Auth();
                auth.user = user;
                auth.bearer_token = bearerToken;
                auth.level = AuthLevel.USER;
                await authRepository.save(auth);

                if (auth) {
                    return res.status(201).json({
                        isSuccess: true,
                        auth: {
                            id: auth.id,
                            bearer_token: auth.bearer_token,
                            level: auth.level,
                            user: {
                                id: auth.user.id,
                                username: auth.user.username,
                            }
                        }
                    });
                }
            }
        }
    }

    return res.status(201).json({
        isSuccess: false,
        auth: {}
    });
})

router.get("/guest", async(req: Request, res: Response) => {
    let bearerToken = "Bearer " + CryptoJS.lib.WordArray.random(512 / 8).toString(CryptoJS.enc.Hex);

    const connection = getConnection("connection1");
    const authRepository = connection.getRepository(Auth);

    const auth = new Auth();
    auth.bearer_token = bearerToken;
    auth.level = AuthLevel.GUEST;
    await authRepository.save(auth);

    if (auth) {
        return res.status(201).json({
            isSuccess: true,
            auth: {
                id: auth.id,
                bearer_token: auth.bearer_token,
                level: auth.level
            }
        });
    }

    return res.status(201).json({
        isSuccess: false,
        auth: {}
    });
});

export default router;