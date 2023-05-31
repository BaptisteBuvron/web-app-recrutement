// @ts-nocheck
const passport = require('passport');
const localStrategy = require("passport-local").Strategy;
const {v4:uuidv4} = require("uuid");
const users = require("./users.json");
const bcrypt = require("bcrypt");
const fs = require("fs");

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

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    passport,
    loggedIn
};
