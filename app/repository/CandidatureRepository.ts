import {Candidature} from "../entity/Candidature";
import {pool} from "../database";
import {User} from "../entity/User";
import {OffreDePoste} from "../entity/OffreDePoste";
import {FicheDePoste} from "../entity/FicheDePoste";

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
                              FDP.siren
                       FROM Candidature
                                LEFT JOIN OffreDePoste ODP on Candidature.offre = ODP.numero
                                LEFT JOIN FicheDePoste FDP on ODP.fiche = FDP.numero
                       WHERE candidat = ?`;
        return new Promise<Candidature[]>((resolve, reject) => {
            pool.query(query, [user.email], (err, result) => {
                if (err) {
                    return reject(err);
                }
                let candidatures: Candidature[] = [];
                for (let i = 0; i < result.length; i++) {
                    let fiche = new FicheDePoste(result[i].fiche_numero, result[i].fiche_statut, result[i].responsable, result[i].type_metier, result[i].lieu, result[i].teletravail, result[i].nb_heures, result[i].salaire, result[i].description, result[i].siren);
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
                              FDP.siren
                       FROM Candidature
                                LEFT JOIN OffreDePoste ODP on Candidature.offre = ODP.numero
                                LEFT JOIN FicheDePoste FDP on ODP.fiche = FDP.numero
                                LEFT JOIN Utilisateur U on Candidature.candidat = U.email
                       WHERE FDP.siren = ?`;
        return new Promise<Candidature[]>((resolve, reject) => {
            pool.query(query, [siren], (err, result) => {
                if (err) {
                    return reject(err);
                }
                let candidatures: Candidature[] = [];
                for (let i = 0; i < result.length; i++) {
                    let fiche = new FicheDePoste(result[i].fiche_numero, result[i].fiche_statut, result[i].responsable, result[i].type_metier, result[i].lieu, result[i].teletravail, result[i].nb_heures, result[i].salaire, result[i].description, result[i].siren);
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

}