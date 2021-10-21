import { debug } from "console";
import {Request, Response, Router } from "express";
const router: Router = Router();

import { hashPassword } from "../../password";
import User from '../../entity/User';
import Auth, { AuthLevel } from "../../entity/Auth";
import {getRepository, getConnection} from "typeorm";
import CryptoJS from "crypto-js";

import jwt from 'jsonwebtoken';
import jwtConfig from '../../jwt';

router.post("/", async(req: Request, res: Response): Promise<Response> => {
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
                const token = jwt.sign({
                    data: {
                        id: user.id
                    }
                }, jwtConfig.secret, { expiresIn: '7d' });

                return res.status(201).json({
                    isSuccess: true,
                    jwt_token: token,
                    user: {
                        id: user.id,
                        username: user.username,
                        profile_picture: user.profile_picture,
                        email: user.email
                    }
                });
            }
        }
    }

    return res.status(201).json({
        isSuccess: false,
        auth: {}
    });
})

export default router;