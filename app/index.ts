import dotenv from "dotenv";
import express, {Express} from "express";
import cors from "cors";
import {defaultRouter} from "./routes/MainRouter";
import {offerRouter} from "./routes/OfferRouter";
import {adminRouter} from "./routes/AdminRouter";
import {ficheRouter} from "./routes/FicheRouter";
import bodyParser from "body-parser";
import {recruterRouter} from "./routes/RecruterRouter";
import {apiRouter} from "./routes/ApiRouter";

const {passport} = require("./passport/passportFunctions");

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use("/", defaultRouter);
app.use("/offre", offerRouter);
app.use("/fiche", ficheRouter);
app.use("/admin", adminRouter);
app.use("/recruteur", recruterRouter);
app.use("/api", apiRouter);


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`web-app-recrutement listening on port ${port}`)
});

