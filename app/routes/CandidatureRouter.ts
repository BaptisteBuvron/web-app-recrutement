import {Router} from "express";
import {CandidatureController} from "../controllers/CandidatureController";

export const candidatureRouter = Router();

candidatureRouter.get("/candidatures", CandidatureController.candidatures);

candidatureRouter.get("/canditature/:numero", CandidatureController.candidater);
candidatureRouter.post("/canditature/:numero", CandidatureController.candidater);

