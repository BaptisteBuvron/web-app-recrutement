import express from "express";
import {FicheDePosteRepository} from "../repository/FicheDePosteRepository";
import {OffreDePoste} from "../entity/OffreDePoste";
import {OfferRepository} from "../repository/OfferRepository";
import {FicheDePoste} from "../entity/FicheDePoste";
import {Alert} from "../utils/Alert";
import {loggedInNoRedirection} from "../passport/passportFunctions";

export class OfferController {


    public static async creation(req: express.Request, res: express.Response) {

        const alerts: Alert[] = [];
        console.log(req.method);

        if (req.method === "POST") {
            //TODO validation data
            let listePiece: string = "";
            let nbPiece: number = 0;
            if (req.body.portfolio) {
                listePiece += "portfolio,";
                nbPiece++;
            }
            if (req.body.cv) {
                listePiece += "cv,";
                nbPiece++;
            }
            if (req.body.motivation) {
                nbPiece++;
                listePiece += "lettreMotivation,";
            }


            await FicheDePosteRepository.getById(req.body.ficheDePoste).then(async (ficheDePoste: FicheDePoste) => {
                let offreDePoste: OffreDePoste = new OffreDePoste(
                    0,
                    req.body.etat,
                    req.body.dateValidite,
                    nbPiece,
                    listePiece,
                    ficheDePoste);
                //TODO save the ficheDePoste in the database
                await OfferRepository.create(offreDePoste).then((offreDePoste) => {
                    let alert = new Alert("success", "L'offre a été créée.");
                    alerts.push(alert);
                }).catch((err) => {
                    console.log(err);
                    let alert = new Alert("danger", "L'offre n'a pas été créée.");
                    alerts.push(alert);
                });
            })
                .catch((err) => {
                    console.log(err);
                    let alert = new Alert("danger", "La fiche de poste n'existe pas.");
                    alerts.push(alert);
                })


        }
        //TODO selectionner seulement les fiches de postes de l'organisation du recruteur
        FicheDePosteRepository.getAll().then((ficheDePostes) => {
            return res.render("offre/creation", {
                title: "Créer une offre",
                ficheDePostes: ficheDePostes,
                alerts: alerts,
                user: loggedInNoRedirection(req, res)
            });
        });


    }
}
