import * as express from "express";
import * as bodyParser from "body-parser";
import * as  cors from "cors";
import { Routes } from "./routes/Routes";
import * as mongoose from "mongoose";
import * as dotenv from 'dotenv';


// initialize configuration
dotenv.config()

class App {
    public app: express.Application;
    public route: Routes = new Routes();
    public mongoUrl: string = process.env.MONGO_URL;

    constructor() {
        this.app = express();
        this.config();
        this.route.routes(this.app);
        this.mongoSetup();

    }
    private config(): void {
        // set up cors
        const corsOptions = {
            origin: process.env.CLIENT_URL
        };
        this.app.use(cors(corsOptions));

        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

    }


    private mongoSetup(): void {

        // mongodb connection

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        };

        //connect to mongodb database
        mongoose.connect(this.mongoUrl, options).then(() => {
            console.log("Successfully connected to DB.");
        })

            .catch(err => {
                console.error("Connection error", err);
                process.exit();
            });

    }
}
export default new App().app;