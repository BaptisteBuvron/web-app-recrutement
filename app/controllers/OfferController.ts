import express from "express";

export class OfferController {


    public static creation(req: express.Request, res: express.Response) {
        res.render("offre/creation", { title: "Créer une offre" });
    }
}