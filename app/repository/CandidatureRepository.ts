import {Candidature} from "../entity/Candidature";
import {pool} from "../database";
import {User} from "../entity/User";
import {OffreDePoste} from "../entity/OffreDePoste";
import {FicheDePoste} from "../entity/FicheDePoste";
import {Organisation} from "../entity/Organisation";

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
                              O.nom as nom_organisation,
                              O.type as type_organisation,
                              O.siege as siege_organisation
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
}