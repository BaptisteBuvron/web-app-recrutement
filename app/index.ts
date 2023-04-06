import dotenv from "dotenv";
import express, {Express} from "express";
import cors from "cors";
import {defaultRouter} from "./routes/MainRouter";
import {offerRouter} from "./routes/OfferRouter";

dotenv.config();


const app: Express = express();

app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use("/", defaultRouter);
app.use("/offer", offerRouter);


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});