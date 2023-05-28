import {Router} from "express";
import {HomeController} from "../controllers/HomeController";
const jwt = require("jsonwebtoken");
const fs = require("fs");
// @ts-ignore
import * as fakeLocal from "../fakeLocal.json";

export const defaultRouter = Router();

defaultRouter.get("/", HomeController.index);

defaultRouter.get("/createtoken", async(req, res)=>{
    let user = {name:"joey", favColor: "blue", id:"123"};

    const token = jwt.sign({user : user}, "TOP_SECRET_KEY");

    console.log("token : ", token);
    console.log(fakeLocal);
    await fs.writeFile(
        "./fakeLocal.json",
        JSON.stringify({ Authorization: `Bearer ${token}`}),
        (err: any)=>{
            if (err) throw err;
            console.log("updated the fake local storage in the fake browser");
        }
    );

    res.send("coming soon create Token");
});

defaultRouter.get("/profile", async(req, res)=>{
    console.log("authorisation token : ", fakeLocal.Authorization);

    const result = await jwt.verify(
        fakeLocal.Authorization.substring(7),
        "TOP_SECRET_KEY"
    );
    result.message="token décrypté !";
    res.json(result);
});

defaultRouter.get("/login", HomeController.login);
defaultRouter.get("/register", HomeController.register);
defaultRouter.get("/recruiter", HomeController.recruiter);
defaultRouter.post("/recruiter", HomeController.recruiter);

