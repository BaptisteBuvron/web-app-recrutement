import {Router} from "express";
import {ApiController} from "../controllers/ApiController";

export const apiRouter = Router();

apiRouter.get("/offers", ApiController.getOffers);
apiRouter.get("/user", ApiController.getUser);

