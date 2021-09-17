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
import Friend, { FriendStatus, FriendRequestStatus} from "./entity/Friend";
import Club, {ClubMember, ClubBulletin, ClubBulletinKeyword} from "./entity/Club";

// Path
import path from 'path';

// Routes
import v1UserRouter from "./routes/v1/user";
import v1AuthRouter from "./routes/v1/auth";
import v1PictureRouter from "./routes/v1/picture";
import v1FriendRouter from "./routes/v1/friend";
import v1FindRouter from "./routes/v1/find";
import v1ClubRouter from "./routes/v1/club";

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

    let auth = await authRepository.findOne({select: ["id","bearer_token", "level" ], relations: ["user"], where: {bearer_token: bearerToken}});

    if (auth) {
        res.locals.user = auth.user;
    }
    
    next();
};

// Static files
app.use('/res', express.static(path.join(__dirname, '../public')));

// Version 1 of the API.
const v1Router = express.Router();

v1Router.use(authorizeClient);
v1Router.use("/users", v1UserRouter);
v1Router.use("/auth", v1AuthRouter);
v1Router.use("/pictures", v1PictureRouter);
v1Router.use("/friends", v1FriendRouter);
v1Router.use("/find", v1FindRouter);
v1Router.use("/club", v1ClubRouter);

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