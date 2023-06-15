import express from "express";
import {RecruteurController} from "../controllers/RecruteurController";
import {offerRouter} from "./OfferRouter";
const { passport, loggedIn, checkRole } = require("../passport/passportFunctions");

export const recruterRouter = express.Router();
recruterRouter.use(passport.initialize());
recruterRouter.use(passport.session());
recruterRouter.get("/", checkRole("Recruteur"), RecruteurController.index);
recruterRouter.get("/candidatures", checkRole("Recruteur"), RecruteurController.candidatures);

