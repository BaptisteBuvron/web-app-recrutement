import express from "express";
import {FicheDePoste} from "../entity/FicheDePoste";
import {FicheDePosteRepository} from "../repository/FicheDePosteRepository";

export class FicheController {

    public static creation(req: express.Request, res: express.Response) {
        if (req.method === "POST") {
            //TODO validation data
            let teletravail: boolean = req.body.teletravail === "on";
            //TODO get the siren from the recruiter
            //random number 9 digits
            let random = Math.floor(Math.random() * 1000000000);
            let siren: string = String(random);
            let nbHeures: number = parseInt(req.body.nbHeures);


            let ficheDePoste: FicheDePoste = new FicheDePoste(
                0,
                req.body.status,
                req.body.responsable,
                req.body.typeMetier,
                req.body.lieu,
                teletravail,
                nbHeures,
                req.body.salaire,
                req.body.description,
                siren);

            //TODO save the ficheDePoste in the database
            FicheDePosteRepository.create(ficheDePoste).then((ficheDePoste) => {
                return res.redirect("/fiche/creation");
            })
                .catch((err) => {
                    console.log(err);
                    return res.redirect("/fiche/creation");
                });

        } else {
            //TODO get the siren from the recruiter
            res.render("fiche/creation", {title: "Créer une fiche de poste"});
        }
    }
}