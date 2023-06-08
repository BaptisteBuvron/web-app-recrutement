import express from "express";
import {RecruteurController} from "../controllers/RecruteurController";

export const recruterRouter = express.Router();

recruterRouter.get("/", RecruteurController.index);
recruterRouter.get("/candidatures", RecruteurController.candidatures);
recruterRouter.get("/offres", RecruteurController.offres);

