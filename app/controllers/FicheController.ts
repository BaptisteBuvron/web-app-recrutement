import express from "express";
import {FicheDePoste} from "../entity/FicheDePoste";
import {FicheDePosteRepository} from "../repository/FicheDePosteRepository";
import {Alert} from "../utils/Alert";
import {loggedInNoRedirection} from "../passport/passportFunctions";

export class FicheController {

    public static async creation(req: express.Request, res: express.Response) {
        const alerts: Alert[] = [];
        if (req.method === "POST") {
            //TODO validation data
            let teletravail: boolean = req.body.teletravail === "on";

            let siren: string = req.user.organisation?.siren as string;
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
        res.render("fiche/creation", {title: "Créer une fiche de poste", alerts: alerts, userLogged: loggedInNoRedirection(req, res)});

    }
}
