import {Candidature} from "../entity/Candidature";
import {pool} from "../database";
import {User} from "../entity/User";
import {OffreDePoste} from "../entity/OffreDePoste";
import {FicheDePoste} from "../entity/FicheDePoste";
import {Organisation} from "../entity/Organisation";
import {PieceRepository} from "./PieceRepository";

export class CandidatureRepository {
    static create(candidature: Candidature): Promise<Candidature> {
        const query = `INSERT INTO Candidature (date_candidature, candidat, offre, statut, motivation)
                       VALUES (?, ?, ?, ?, ?)`;
        return new Promise<Candidature>((resolve, reject) => {
            pool.query(query, [candidature.date, candidature.candidat.email, candidature.offre.numero, candidature.statut, candidature.motivation], (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(candidature);
            });
        });
    }

    static getByUser(user: User): Promise<Candidature[]> {
        const query = `SELECT Candidature.candidat,
                              Candidature.offre,
                              Candidature.statut as candidature_statut,
                              Candidature.motivation,
                              ODP.numero         as offre_numero,
                              ODP.etat,
                              ODP.date_validite,
                              ODP.nb_piece,
                              ODP.liste_piece,
                              FDP.numero         as fiche_numero,
                              FDP.status         as fiche_statut,
                              FDP.responsable,
                              FDP.type_metier,
                              FDP.lieu,
                              FDP.teletravail,
                              FDP.nb_heures,
                              FDP.salaire,
                              FDP.description,
                              FDP.siren,
                              O.nom              as nom_organisation,
                              O.type             as type_organisation,
                              O.siege            as siege_organisation
                       FROM Candidature
                                LEFT JOIN OffreDePoste ODP on Candidature.offre = ODP.numero
                                LEFT JOIN FicheDePoste FDP on ODP.fiche = FDP.numero
                                INNER JOIN Organisation O ON O.siren = FDP.siren
                       WHERE candidat = ?`;
        return new Promise<Candidature[]>((resolve, reject) => {
            pool.query(query, [user.email], (err, result) => {
                if (err) {
                    return reject(err);
                }
                let candidatures: Candidature[] = [];
                for (let i = 0; i < result.length; i++) {
                    let organisation = new Organisation(result[0].siren, result[0].nom_organisation, result[0].type_organisation, result[0].siege_organisation);
                    let fiche = new FicheDePoste(result[i].fiche_numero, result[i].fiche_statut, result[i].responsable, result[i].type_metier, result[i].lieu, result[i].teletravail, result[i].nb_heures, result[i].salaire, result[i].description, result[i].siren, organisation);
                    let offre = new OffreDePoste(result[i].offre_numero, result[i].etat, result[i].date_validite, result[i].nb_piece, result[i].liste_piece, fiche);

                    candidatures.push(new Candidature(
                        result[i].date_candidature,
                        user,
                        offre,
                        result[i].candidature_statut,
                        result[i].motivation
                    ));
                }
                return resolve(candidatures);
            });
        });
    }

    static getBySiren(siren: string): Promise<Candidature[]> {
        const query = `SELECT Candidature.candidat,
                              U.email,
                              U.nom,
                              U.prenom,
                              U.telephone,
                              U.date_creation,
                              U.statut           as user_statut,
                              U.password,
                              U.role,
                              U.demande_organisation,
                              U.siren            as user_siren,
                              Candidature.offre,
                              Candidature.statut as candidature_statut,
                              Candidature.motivation,
                              ODP.numero         as offre_numero,
                              ODP.etat,
                              ODP.date_validite,
                              ODP.nb_piece,
                              ODP.liste_piece,
                              FDP.numero         as fiche_numero,
                              FDP.status         as fiche_statut,
                              FDP.responsable,
                              FDP.type_metier,
                              FDP.lieu,
                              FDP.teletravail,
                              FDP.nb_heures,
                              FDP.salaire,
                              FDP.description,
                              FDP.siren,
                              O.nom,
                              O.type,
                              O.siege
                       FROM Candidature
                                LEFT JOIN OffreDePoste ODP on Candidature.offre = ODP.numero
                                LEFT JOIN FicheDePoste FDP on ODP.fiche = FDP.numero
                                LEFT JOIN Utilisateur U on Candidature.candidat = U.email
                                LEFT JOIN Organisation O on FDP.siren = O.siren
                       WHERE FDP.siren = ?`;
        return new Promise<Candidature[]>((resolve, reject) => {
            pool.query(query, [siren], (err, result) => {
                if (err) {
                    return reject(err);
                }
                let candidatures: Candidature[] = [];
                for (let i = 0; i < result.length; i++) {
                    let organisation = new Organisation(result[i].siren, result[i].nom, result[i].type, result[i].siege);
                    let fiche = new FicheDePoste(result[i].fiche_numero, result[i].fiche_statut, result[i].responsable, result[i].type_metier, result[i].lieu, result[i].teletravail, result[i].nb_heures, result[i].salaire, result[i].description, result[i].siren, organisation);
                    let offre = new OffreDePoste(result[i].offre_numero, result[i].etat, result[i].date_validite, result[i].nb_piece, result[i].liste_piece, fiche);
                    let candidat = new User(result[i].candidat, result[i].email, result[i].prenom, result[i].telephone, result[i].date_creation, result[i].user_statut, result[i].password, result[i].role, result[i].demande_organisation, result[i].user_siren);
                    candidatures.push(new Candidature(
                        result[i].date_candidature,
                        candidat,
                        offre,
                        result[i].candidature_statut,
                        result[i].motivation
                    ));
                }
                return resolve(candidatures);
            });
        });
    }

    static getById(email: string, offerNumber: string): Promise<Candidature | null> {
        const query = `SELECT Candidature.candidat,
                              U.email,
                              U.nom              as user_nom,
                              U.prenom,
                              U.telephone,
                              U.date_creation,
                              U.statut           as user_statut,
                              U.password,
                              U.role,
                              U.demande_organisation,
                              U.siren            as user_siren,
                              Candidature.offre,
                              Candidature.statut as candidature_statut,
                              Candidature.motivation,
                              Candidature.date_candidature,
                              ODP.numero         as offre_numero,
                              ODP.etat,
                              ODP.date_validite,
                              ODP.nb_piece,
                              ODP.liste_piece,
                              FDP.numero         as fiche_numero,
                              FDP.status         as fiche_statut,
                              FDP.responsable,
                              FDP.type_metier,
                              FDP.lieu,
                              FDP.teletravail,
                              FDP.nb_heures,
                              FDP.salaire,
                              FDP.description,
                              FDP.siren,
                              O.nom,
                              O.type,
                              O.siege
                       FROM Candidature
                                LEFT JOIN OffreDePoste ODP on Candidature.offre = ODP.numero
                                LEFT JOIN FicheDePoste FDP on ODP.fiche = FDP.numero
                                LEFT JOIN Utilisateur U on Candidature.candidat = U.email
                                LEFT JOIN Organisation O on FDP.siren = O.siren
                       WHERE Candidature.candidat = ?
                         AND Candidature.offre = ?`;

        return new Promise<Candidature | null>((resolve, reject) => {
            pool.query(query, [email, offerNumber], async (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.length === 0) {
                    return resolve(null);
                }
                let pieces = await PieceRepository.getByCandidature(result[0].email, result[0].offre_numero).then((pieces) => {
                    return pieces;
                }).catch((err) => {
                    return [];
                });

                let organisation = new Organisation(result[0].siren, result[0].nom, result[0].type, result[0].siege);
                let fiche = new FicheDePoste(result[0].fiche_numero, result[0].fiche_statut, result[0].responsable, result[0].type_metier, result[0].lieu, result[0].teletravail, result[0].nb_heures, result[0].salaire, result[0].description, result[0].siren, organisation);
                let offre = new OffreDePoste(result[0].offre_numero, result[0].etat, result[0].date_validite, result[0].nb_piece, result[0].liste_piece, fiche);
                let candidat = new User(result[0].candidat, result[0].user_nom, result[0].prenom, result[0].telephone, result[0].date_creation, result[0].user_statut, result[0].password, result[0].role, result[0].demande_organisation, result[0].user_siren);
                return resolve(new Candidature(
                    result[0].date_candidature,
                    candidat,
                    offre,
                    result[0].candidature_statut,
                    result[0].motivation,
                    pieces
                ));
            });
        });

    }
}
