// @ts-nocheck
import {Router} from "express";
import {HomeController} from "../controllers/HomeController";
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require('../passport/passportFunctions');
const {v4:uuidv4} = require("uuid");
const users = require("../passport/users.json");
//import * as utilisateurs from "../users.json";
const secureRoutes = require("./SecureRoutes");

export const defaultRouter = Router();

defaultRouter.use("/user", secureRoutes);
defaultRouter.get("/", HomeController.index);
defaultRouter.get("/login", HomeController.login);
defaultRouter.get("/register", HomeController.register);
defaultRouter.get("/recruiter", HomeController.recruiter);
defaultRouter.post("/recruiter", HomeController.recruiter);



defaultRouter.use(
    session({
        genid: (req) => {
            console.log("1. in genid req.sessionID: ", req.sessionID);
            return uuidv4();
        },
        store: new FileStore(),
        secret: "a private key",
        resave: false,
        saveUninitialized: false,
    })
);

defaultRouter.use(passport.initialize());
defaultRouter.use(passport.session());

defaultRouter.post(
    "/login",
    function (req, res, next) {
        passport.authenticate("login", async (err, user, info) => {
            console.log("err: ", err);
            console.log("user: ", user);
            console.log("info: ", info);

            if (err) {
                return next(err);
            }

            if (!user) {
                return res.redirect(`/failed?message=${info.message}`);
            }
            req.login(user, async (error) => {
                return res.redirect(`success?message=${info.message}`);
            });
        })(req, res, next);
    },
    (req, res, next) => {
        res.send("Hello"); // able to add functions after the authenticate call now.
    }
);

defaultRouter.post("/register", async(req, res, next)=>{
    // @ts-ignore
    passport.authenticate("register", async function(error, user, info){
        if(error){
            return next(error.message);
        }

        if(!user){
            res.redirect(`/failed?message=${info.message}`);
        }
        req.login(user, async (error) => {
            if (error) {
                return next(error);
            }
            return res.redirect(`/success?message=${info.message}`);
        });
    })(req, res, next)
});

defaultRouter.get("/success", (req, res) => {
    console.log("req.query: ", req.query);
    console.log("req.isAuthenticated: ", req.isAuthenticated());

    res.send(`You're in! ${req.query.message}`);
});

defaultRouter.get("/failed", (req, res, next)=>{
    res.send(`failed ${req.query?.message}`);
});
defaultRouter.get("/users", (req, res, next)=>{
    console.log(users);
    res.send("voir logs");
});

defaultRouter.get("/secureroute", (req, res)=>{
        if (req.isAuthenticated()) {
            res.send("req.isAuthenticated: ", req.isAuthenticated());
            res.send("req.user: ", req.user); // does this for me.
            res.send("req.login: ", req.login);
            res.send("req.logout: ", req.logout);
        } else {
            res.send("Must log in first. visit /login");
        }
    }
)

defaultRouter.get("/logout", async (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});
