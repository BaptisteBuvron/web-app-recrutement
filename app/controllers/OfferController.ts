import express from "express";
import {FicheDePosteRepository} from "../repository/FicheDePosteRepository";
import {OffreDePoste} from "../entity/OffreDePoste";
import {OfferRepository} from "../repository/OfferRepository";
import {FicheDePoste} from "../entity/FicheDePoste";

export class OfferController {


    public static creation(req: express.Request, res: express.Response) {

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

            FicheDePosteRepository.getById(req.body.ficheDePoste).then((ficheDePoste: FicheDePoste) => {
                let offreDePoste: OffreDePoste = new OffreDePoste(
                    0,
                    req.body.etat,
                    req.body.dateValidite,
                    nbPiece,
                    listePiece,
                    ficheDePoste);
                //TODO save the ficheDePoste in the database
                OfferRepository.create(offreDePoste).then((offreDePoste) => {
                    return res.redirect("/offre/creation");
                }).catch((err) => {
                    console.log(err);
                    return res.redirect("/offre/creation");
                });
            })
                .catch((err) => {
                    console.log(err);
                    return res.redirect("/offre/creation");
                });


        } else {
            //TODO selectionner seulement les fiches de postes de l'organisation du recruteur
            FicheDePosteRepository.getAll().then((ficheDePostes) => {
                return res.render("offre/creation", {title: "Créer une offre", ficheDePostes: ficheDePostes});
            });
        }


    }
}