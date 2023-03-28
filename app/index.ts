import dotenv from "dotenv";
import express, {Express} from "express";
import cors from "cors";
import {defaultRoute} from "./routes/MainRouter";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/", defaultRoute);


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});