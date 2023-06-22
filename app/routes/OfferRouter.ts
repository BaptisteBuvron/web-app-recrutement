import express from "express";
import {OfferController} from "../controllers/OfferController";

const { passport, loggedIn, checkRole } = require("../passport/passportFunctions");

export const offerRouter = express.Router();
offerRouter.use(passport.initialize());
offerRouter.use(passport.session());
offerRouter.get("/creation", checkRole("Recruteur"), OfferController.creation);
offerRouter.post("/creation", checkRole("Recruteur"), OfferController.creation);
offerRouter.get("/:numero", loggedIn(), OfferController.offre);
