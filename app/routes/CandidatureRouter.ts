import {Router} from "express";
import {CandidatureController} from "../controllers/CandidatureController";
import {v4 as uuidv4} from 'uuid';
import multer, {Multer} from 'multer';
const { passport, loggedIn, checkRole } = require("../passport/passportFunctions");

export const candidatureRouter = Router();

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

candidatureRouter.use(passport.initialize());
candidatureRouter.use(passport.session());

//Vérification de la connexion pour toutes les routes
candidatureRouter.use(checkRole("Candidat"));

candidatureRouter.get("/candidatures", CandidatureController.candidatures);

candidatureRouter.get("/canditature/:numero", CandidatureController.candidater);
candidatureRouter.post("/canditature/:numero", upload.fields([
  {name: 'cv', maxCount: 1},
  {name: 'lettre', maxCount: 1}
]), CandidatureController.candidater);



