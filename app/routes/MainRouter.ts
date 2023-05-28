import {Router} from "express";
import {HomeController} from "../controllers/HomeController";
const jwt = require("jsonwebtoken");
const fs = require("fs");
// @ts-ignore
import * as fakeLocal from "../fakeLocal.json";
const passport = require('passport');
const {v4:uuidv4} = require("uuid");
const localStrategy = require("passport-local").Strategy
// @ts-ignore
const users = require("../users.json")
//import * as utilisateurs from "../users.json";
const bcrypt = require("bcrypt")
const JWTstrategy = require("passport-jwt").Strategy
const secureRoutes = require("./SecureRoutes");

export const defaultRouter = Router();

defaultRouter.use("/user", secureRoutes);


defaultRouter.use(passport.initialize());

defaultRouter.get("/", HomeController.index);
defaultRouter.get("/login", HomeController.login);
defaultRouter.get("/register", HomeController.register);

function getJwt(){
    console.log("in getJwt");
    return fakeLocal.Authorization?.substring(7);
}

passport.use(
    new JWTstrategy(
        {
            secretOrKey: "TOP_SECRET",
            jwtFromRequest: getJwt,
        },
        // @ts-ignore
        async (token, done) => {
            console.log("in jwt strat. token: ", token);

            // 0. Don't even make it through the getJwt function check. NO token
            // prints unauthorized.

            // 0B. Invalid token: again doesn't make it into this function. Prints unauthorized

            // 1. Makes it into this function but gets App error (displays error message.) no redirecting.
            // We simulate an "application error" occurring in this function with an email of "tokenerror".
            //
            if (token?.user?.email == "tokenerror") {
                let testError = new Error(
                    "something bad happened. we've simulated an application error in the JWTstrategy callback for users with an email of 'tokenerror'."
                );
                return done(testError, false);
            }

            if (token?.user?.email == "emptytoken") {
                // 2. Some other reason for user to not exist. pass false as user:
                // displays "unauthorized". Doesn't allow the app to hit the next function in the chain.
                // We are simulating an empty user / no user coming from the JWT.
                return done(null, false); // unauthorized
            }

            // 3. Successfully decoded and validated user:
            // (adds the req.user, req.login, etc... properties to req. Then calls the next function in the chain.)
            return done(null, token.user);
    }
    )
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

            // It doesn't seem like the req.login() does anything for us when using JWT.
            // I could be wrong though. You'll have to play around with it yourself.
            // req.login(user, { session: false }, async (error) => {
            // console.log("using req.login...");

            const body = { _id: user.id, email: user.email };

            const token = jwt.sign({ user: body }, "TOP_SECRET");

            await fs.writeFile(
                "fakeLocal.json",
                JSON.stringify({ Authorization: `Bearer ${token}` }),
                (err) => {
                    if (err) throw err; // we might need to put this in a try catch, but we'll ignore it since it's unrelated to passport and auth.
                }
            );

            return res.redirect(`success?message=${info.message}`);
            // }); // this is the closing brackets for the req.login
        })(req, res, next);
    },
    (req, res, next) => {
        res.send("Hello"); // able to add functions after the authenticate call now.
    }
);




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

defaultRouter.post("/register", async(req, res, next)=>{
    // @ts-ignore
    passport.authenticate("register", async function(error, user, info){
        console.log("user:", user);
        if(error){
            return next(error.message);
        }

        if(!user){
            res.redirect(`/failed?message=${info.message}`);
        }

        const body = { _id: user.id, email: user.email };

        console.log("body : ", body);

        const token = jwt.sign({user: body}, "TOP_SECRET");

        await fs.writeFile(
            "./fakeLocal.json",
            JSON.stringify({ Authorization: `Bearer ${token}`}),
            // @ts-ignore
            (err)=>{
                if (err) throw err;
            }
        );

        res.redirect(`/success?message=${info.message}`);
    })(req, res, next)
});



defaultRouter.get("/success", (req, res, next)=>{
    res.send(`success ${req.query?.message}`);
});
defaultRouter.get("/failed", (req, res, next)=>{
    res.send(`failed ${req.query?.message}`);
});
defaultRouter.get("/users", (req, res, next)=>{
    console.log(users);
    res.send("users");
});

defaultRouter.get(
    "/secureroute",
    passport.authenticate("jwt", {session: false}),
    async(req, res)=>{
        console.log("------ beginning of /secureroute -----");
        console.log("req.isAuthenticated: ", req.isAuthenticated());
        console.log("req.user: ", req.user); // does this for me.
        console.log("req.login: ", req.login);
        console.log("req.logout: ", req.logout);
        res.send(`welcome to the top secret place ${req.user.email}`);
    }
)

defaultRouter.get("/logout", async (req, res) => {
    await fs.writeFile(
        "fakeLocal.json",
        JSON.stringify({ Authorization: `` }),
        (err) => {
            if (err) throw err;
        }
    );

    res.redirect("/login");
});

defaultRouter.get("/recruiter", HomeController.recruiter);
defaultRouter.post("/recruiter", HomeController.recruiter);

