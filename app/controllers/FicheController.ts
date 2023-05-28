import express from "express";
import {FicheDePoste} from "../entity/FicheDePoste";
import {FicheDePosteRepository} from "../repository/FicheDePosteRepository";
import {Alert} from "../utils/Alert";

export class FicheController {

    public static async creation(req: express.Request, res: express.Response) {
        const alerts: Alert[] = [];
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
                siren,
                );
            await FicheDePosteRepository.create(ficheDePoste).then((ficheDePoste) => {
                let alert = new Alert("success", "La fiche de poste a été créée.");
                alerts.push(alert);
            })
                .catch((err) => {
                    let alert = new Alert("danger", "La fiche de poste n'a pas été créée.");
                    alerts.push(alert);
                    console.log(err);
                });

        }
        //TODO get the siren from the recruiter
        res.render("fiche/creation", {title: "Créer une fiche de poste", alerts: alerts});

    }
}
