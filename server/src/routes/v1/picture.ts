import { debug } from "console";
import {Request, Response, Router } from "express";
import User from '../../entity/User';
import {getRepository, getConnection} from "typeorm";

import multiparty from "multiparty";
import fs from "fs";

import CryptoJS from "crypto-js";

const router: Router = Router();

import path from 'path';

router.post('/', async(req: Request, res: Response): Promise<Response> => {
    const form: multiparty.Form = new multiparty.Form();

    let imageCode = CryptoJS.lib.WordArray.random(256 / 8).toString(CryptoJS.enc.Hex); // TODO: Check for an image with that code
    let imageFormat = "png";
    let imageFolder = "../../../public/images";
    
    form.parse(req, function(err, fields, files) {
        Object.keys(files).forEach(name => {
            debug(files[name]);
            let file = files[name][0];

            let inputFile = fs.readFile(file.path, (err, data) => {
                if (err) {
                    debug("Error:", err);
    
                    return res.status(500).json({
                        isSuccess: false,
                        image: {}
                    });
                }
    
                let outputFile = fs.writeFile(path.join(__dirname, `${imageFolder}/${imageCode}.${imageFormat}`), data, (err) => {
                    if (err) {
                        debug("Error:", err);
    
                        return res.status(500).json({
                            isSuccess: false,
                            image: {}
                        });
                    }
                });
            });
        });
    });

    return res.status(201).json({
        isSuccess: true,
        image: {
            url: `/res/images/${imageCode}.${imageFormat}`,
        }
    });
});

export default router;