import express from "express";
import {FicheDePosteRepository} from "../repository/FicheDePosteRepository";
import {OffreDePoste} from "../entity/OffreDePoste";
import {OfferRepository} from "../repository/OfferRepository";
import {FicheDePoste} from "../entity/FicheDePoste";
import {Alert} from "../utils/Alert";
import {loggedInNoRedirection} from "../passport/passportFunctions";
import {csrfValidation} from "../utils/Security";

export class OfferController {


    public static async creation(req: express.Request, res: express.Response) {

        const alerts: Alert[] = [];

        if (req.method === "POST") {

            let csrfToken = req.body._csrf;
            if (!csrfValidation(req, csrfToken)) {
                alerts.push(new Alert("danger", "Erreur CSRF"));
                return res.redirect("/logout");
            }
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
        let siren: string = req.user.organisation?.siren as string;
        let ficheDePostes: FicheDePoste[] = await FicheDePosteRepository.getBySiren(siren);
        if (ficheDePostes.length === 0) {
            let alert = new Alert("danger", "Vous n'avez pas encore créé de fiche de poste.");
            alerts.push(alert);
            return res.redirect("/fiche-de-poste/creation");
        }
        return res.render("offre/creation", {
            title: "Créer une offre",
            ficheDePostes: ficheDePostes,
            alerts: alerts,
            userLogged: loggedInNoRedirection(req, res),
            csrfToken: req.session.csrfSecret
        });
    }

    public static offre(req: express.Request, res: express.Response) {
        let id: number = parseInt(req.params.numero);
        OfferRepository.getById(id).then((offer: OffreDePoste) => {
            return res.render("offre/offre", {
                title: "Offre",
                offer: offer,
                userLogged: loggedInNoRedirection(req, res)
            });
        }).catch((err) => {
            console.log(err);
            return res.redirect("/offre/liste");
        })
    }
}
