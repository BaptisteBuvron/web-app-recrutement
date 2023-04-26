import express from "express";
import {OfferController} from "../controllers/OfferController";

export const offerRouter = express.Router();

offerRouter.get("/creation", OfferController.creation);
offerRouter.post("/creation", OfferController.creation);