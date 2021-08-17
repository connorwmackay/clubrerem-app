import express, { Application, Request, Response, NextFunction } from "express";
import winston from "winston";
import expressWinston from "express-winston";
import { debug } from "console";
import helmet from "helmet";
import cors from 'cors';

import "reflect-metadata";
import { createConnections, Connection, getConnection, getConnectionManager } from "typeorm";

// Entities
import User from "./entity/User";
import Auth, { AuthLevel } from "./entity/Auth";

// Path
import path from 'path';

// Routes
import v1UserRouter from "./routes/v1/user";
import v1AuthRouter from "./routes/v1/auth";
import v1PictureRouter from "./routes/v1/picture";

const app: Application = express();

app.use(cors());
app.use(express.urlencoded({extended: true}))
app.use(helmet());
app.use(express.json());

async function initDb() {
    const connection = await createConnections([{
        name: "connection1",
        type: "postgres",
        host: "postgres",
        port: 5432,
        username: "postgres",
        password: "postgres",
        database: "postgres",
        entities: [
            __dirname + "/entity/*.ts"
        ],
        synchronize: true,
        logging: false
    }],);
}


// Logging
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false
}));

const authorizeClient = async function (req: Request, res: Response, next: NextFunction) {
    let bearerToken = req.headers['authorization'];

    const connection = getConnection("connection1");
    const authRepository = connection.getRepository(Auth);

    let auth = null;
    if (typeof bearerToken === 'string') {
        auth = await authRepository.findOne({bearer_token: bearerToken});
    }

    if (req.originalUrl === '/api/v1/users' && req.method === 'POST') {
        next();
    } else if (!auth || auth.level === AuthLevel.GUEST) {  
        res.status(401);
        return res.json({
            isAuthorized: "unauthorized"
        });
    } else {
        next();
    }
};

// Static files
app.use('/res', express.static(path.join(__dirname, '../public')));

// Version 1 of the API.
const v1Router = express.Router();

v1Router.use("/auth", v1AuthRouter);
v1Router.use(authorizeClient);
v1Router.use("/users", v1UserRouter);
v1Router.use("/pictures", v1PictureRouter);

app.use('/api/v1', v1Router);

// Error Logging
app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )
}));

// Initialize the connection to the database && start the server.
try {
    initDb();
    app.listen(4001, () => {
        debug(`Initialised server on http://localhost:4001`);
    });
} catch(error) {
    debug(`Could not initialise server. Error: ${error}`);
}