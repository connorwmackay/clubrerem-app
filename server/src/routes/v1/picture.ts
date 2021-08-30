import { debug } from "console";
import {Request, Response, Router } from "express";
import User from '../../entity/User';
import {getRepository, getConnection} from "typeorm";

import multiparty from "multiparty";
import fs from "fs";

import CryptoJS from "crypto-js";

const router: Router = Router();

import path from 'path';

interface PictureResponse {
    isSuccess: boolean,
    image: {
        url: string
    }
}

router.post('/', async(req: Request, res: Response) => {
    const form: multiparty.Form = new multiparty.Form();

    const response: PictureResponse = {
        isSuccess: false,
        image: {
            url: ''
        }
    }

    let imageCode = CryptoJS.lib.WordArray.random(256 / 8).toString(CryptoJS.enc.Hex); // TODO: Check for an image with that code
    let imageFormat = "";
    let imageFolder = "../../../public/images";
    
     form.parse(req, function(err, fields, files) {
        if (!res.locals.user) {
            response.isSuccess = false;
        }

        Object.keys(files).forEach(name => {
            debug(files[name]);

            files[name].forEach((file: multiparty.File) => {
                let inputFile = fs.readFile(file.path, (err, data) => {
                    if (file.size >= 10485760) {
                        debug("File size too large");
                        response.isSuccess = false;
                    } else {
                        if (file.originalFilename.toLowerCase().includes(".png")) {
                            debug("PNG");
                            imageFormat = "png";
                        } else if (file.originalFilename.toLowerCase().includes(".jpg") || file.path.toLowerCase().includes(".jpeg")) {
                            debug("JPG");
                            imageFormat = "jpg";
                        } else {
                            debug("Not an image.");
                        }

                        fs.writeFile(path.join(__dirname, `${imageFolder}/${imageCode}.${imageFormat}`), data, (err) => {
                            if (err) {
                                debug("Error:", err);
                            } else {
                                response.isSuccess = true;
                                response.image.url =  `/res/images/${imageCode}.${imageFormat}`;
                            }

                            debug("Response:", response);
                            res.status(201).json(response);
                        });
                    }
                });
            });

        });
    });
});

export default router;