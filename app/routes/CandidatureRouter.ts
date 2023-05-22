import {Router} from "express";
import {CandidatureController} from "../controllers/CandidatureController";

export const candidatureRouter = Router();

candidatureRouter.get("/canditatures", CandidatureController.candidatures);

candidatureRouter.get("/canditature/:numero", CandidatureController.candidature);
candidatureRouter.post("/canditature/:numero", CandidatureController.candidature);

