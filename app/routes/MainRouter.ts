import {Router} from "express";
import {HomeController} from "../controllers/HomeController";
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const fs = require("fs");
const passport = require('passport');
const {v4:uuidv4} = require("uuid");
const localStrategy = require("passport-local").Strategy
const users = require("../users.json")
//import * as utilisateurs from "../users.json";
const bcrypt = require("bcrypt")
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

passport.serializeUser((user, done) => {
    console.log("in serialize user: ", user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log("in deserialize user: ", user);
    done(null, user);
});

passport.use(
    "register",
    new localStrategy(
        {usernameField: "email", passwordField: "password"},
        // @ts-ignore
        async (email, password, done)=>{
            try{
                if(password.length <= 4 || !email){
                    done(null, false, {
                        message: "Your credentials do not match our criteria",
                    })
                }else{
                    const hashedPass = await bcrypt.hash(password, 10);
                    let newUser = {email, password: hashedPass, id: uuidv4()};
                    console.log(users);
                    //console.log(utilisateurs);
                    users.push(newUser);

                    // @ts-ignore
                    await fs.writeFile("users.json", JSON.stringify(users), (err)=>{
                        if(err) return done(err);
                        console.log("updated the fake database");
                    });

                    return done(null, newUser, {message:"Signed up successfully!"});
                }
            }catch (err){
                return done(err);
            }
        })
);

passport.use(
    "login",
    new localStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            console.log("login named.");
            // done(null, userObject, { message: "Optional success/fail message"});
            // done(err) // Application Error
            // done(null, false, {message: "Unauthorized login credentials!"}) // User input error when 2nd param is false
            console.log(users);
            console.log(email);
            try {
                if (email === "apperror") {
                    throw new Error(
                        "Oh no! The application crashed! We have reported the issue. You can change next(error) to next(error.message) to hide the stack trace"
                    );
                }
                const user = users.find((user) => user.email === email);
                console.log(users);

                if (!user) {
                    return done(null, false, { message: "User not found!" });
                }

                const passwordMatches = await bcrypt.compare(password, user.password);

                if (!passwordMatches) {
                    return done(null, false, { message: "Invalid credentials" });
                }

                return done(null, user, { message: "Hey congrats you are logged in!" });
            } catch (error) {
                return done(error); // application error!
            }
        }
    )
);

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
    res.send("users: ", users);
});

defaultRouter.get("/secureroute", (req, res)=>{
        if (req.isAuthenticated()) {
            res.send(`welcome to the top secret place ${req.user.email}`);
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
