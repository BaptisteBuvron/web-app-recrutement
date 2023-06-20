import {Router} from "express";
import {HomeController} from "../controllers/HomeController";
import multer, {Multer} from "multer";
import {CandidatureController} from "../controllers/CandidatureController";
import {createCSRFToken} from "../middlewares/CSRFMiddlewares";

const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const { passport, checkRole} = require("../passport/passportFunctions");

export const defaultRouter = Router();

defaultRouter.use(
    session({
        genid: (req:any) => {
            console.log("1. in genid req.sessionID: ", req.sessionID);
            return uuidv4();
        },
        store: new FileStore(),
        secret: "a private key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000
        }
    })
);

const upload: Multer = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, './uploads'); // Destination folder
        },
        filename: (req, file, callback) => {
            const uniqueID = uuidv4(); // Generate a unique ID
            const originalFileName = file.originalname;
            const fileName = `${uniqueID}_${originalFileName}`; // Append unique ID to the original filename
            callback(null, fileName);
        },
    }),
});

defaultRouter.use(passport.initialize());
defaultRouter.use(passport.session());
defaultRouter.use(createCSRFToken)

defaultRouter.get("/", HomeController.index);
defaultRouter.get("/login", HomeController.login);
defaultRouter.get("/register", HomeController.register);
defaultRouter.get("/devenir-recruteur", checkRole("Candidat"), HomeController.demandeRecruteur);
defaultRouter.post("/devenir-recruteur", checkRole("Candidat"), HomeController.demandeRecruteur);

defaultRouter.get("/candidatures", checkRole("Candidat"), CandidatureController.candidatures);
defaultRouter.get("/canditature/:numero", checkRole("Candidat"), CandidatureController.candidater);
defaultRouter.post("/canditature/:numero", checkRole("Candidat"), upload.fields([
    {name: 'cv', maxCount: 1},
    {name: 'lettre', maxCount: 1}
]), CandidatureController.candidater);




defaultRouter.post(
    "/login",
    function (req, res, next) {
        passport.authenticate("login", async (err:any, user:any, info:any) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.redirect(`/login?message=${info.message}`);
            }
            req.login(user, async () => {
                let role = user.role;
                let url;
                if (role == "Administrateur") {
                    url="admin";
                } else if(role == "Recruteur"){
                    url="recruteur";
                }else{
                    url="";
                }

                return res.redirect(`/${url}`);
            });
        })(req, res, next);
    }
);

defaultRouter.post("/register", async(req, res, next)=>{
    passport.authenticate("register", async function(error:any, user:any, info:any){
        if(error){
            return next(error.message);
        }

        if(!user){
            res.redirect(`/register?message=${info.message}`);
        }
        req.login(user, async (error:any) => {
            if (error) {
                return next(error);
            }
            return res.redirect(`/`);
        });
    })(req, res, next)
});

defaultRouter.get("/logout", async (req, res) => {
    req.logout(function (err:any) {
        if (err) {
            return err;
        }
        res.redirect("/login");
    });
});
