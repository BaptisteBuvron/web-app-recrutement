import express from "express";
import {OfferRepository} from "../repository/OfferRepository";
import {OffreDePoste} from "../entity/OffreDePoste";
import {Alert} from "../utils/Alert";
import {User} from "../entity/User";
import {CandidatureRepository} from "../repository/CandidatureRepository";
import {Candidature} from "../entity/Candidature";
import {StatutCandidatureEnum} from "../utils/StatutCandidatureEnum";
import {Piece} from "../entity/Piece";
import {PieceRepository} from "../repository/FichierRepository";

export class CandidatureController {
    static candidater(req: express.Request, res: express.Response) {

        //TODO Vérifier que l'utilisateur est bien un candidat
        let user: User = new User('tsoudar21@gmail.com', 'Tillai', 'Soudarsane', '0652645299', new Date('2020-10-10'), false, 'mdp', 'Candidat', "", "123456");

        let alerts: Alert[] = [];
        let numero: number = Number.parseInt(req.params.numero);
        OfferRepository.getById(numero)
            .then(async (offer: OffreDePoste) => {
                    if (req.method === "POST") {
                        //TODO validation data
                        if (req.body.motivation.length <= 20) {
                            let alert = new Alert("danger", "La motivation doit faire plus de 20 caractères.");
                            alerts.push(alert);
                        } else {
                            let user: User = new User('candidat1@example.com', 'Doe', 'John', '123456789', new Date(), true, 'password123', 'Candidat', 'En attente', '1566');
                            let candidature: Candidature = new Candidature(new Date(), user, offer, StatutCandidatureEnum.EN_ATTENTE, req.body.motivation);
                            await CandidatureRepository.create(candidature).then(async (candidature) => {
                                    //upload file:
                                    if (req.files) {
                                        let arrayFiles: Express.Multer.File[] = [];
                                        // @ts-ignore
                                        if (req.files["cv"]) {
                                            // @ts-ignore
                                            arrayFiles.push(req.files["cv"][0]);
                                        }
                                        // @ts-ignore
                                        if (req.files["lettre"]) {
                                            // @ts-ignore
                                            arrayFiles.push(req.files["lettre"][0]);
                                        }
                                        for (let file of arrayFiles) {
                                            let piece: Piece = new Piece(file.originalname, file.path, user, candidature.offre);
                                            await PieceRepository.create(piece)
                                                .catch((err) => {
                                                    let alert = new Alert("danger", "Le fichier n'a pas été enregistré. veuillez contacter l'administrateur.");
                                                    alerts.push(alert);
                                                });
                                        }
                                    }

                                    let alert = new Alert("success", "La candidature a été créée.");
                                    alerts.push(alert);
                                }
                            )
                                .catch((err) => {
                                    console.log(err);
                                    let alert = new Alert("danger", "La candidature n'a pas été créée.");
                                    alerts.push(alert);
                                });

                        }
                    }
                    res.render("candidater", {title: "Candidater", offer: offer, alerts: alerts});

                }
            )
            .catch((reason) => {
                res.redirect("/");
            });
    }


    static candidatures(req: express.Request, res: express.Response) {
        //TODO Vérifier que l'utilisateur est bien un candidat
        let user: User = new User('candidat1@example.com', 'Doe', 'John', '123456789', new Date(), true, 'password123', 'Candidat', 'En attente', '1566');
        CandidatureRepository.getByUser(user).then((candidatures) => {
            res.render("candidatures", {title: "Mes candidatures", candidatures: candidatures});

        }).catch((err) => {
            console.log(err);
            res.redirect("/");
        });

    }
}