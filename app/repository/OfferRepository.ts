import {OffreDePoste} from "../entity/OffreDePoste";
import {pool} from "../database";
import {FicheDePoste} from "../entity/FicheDePoste";
import {FilterOffer} from "../utils/FilterOffer";
import {Organisation} from "../entity/Organisation";

export class OfferRepository {
    static tableName = "OffreDePoste";

    static getAll(filterOffer?: FilterOffer): Promise<[OffreDePoste]> {
        let query = `SELECT OffreDePoste.numero as offre_numero,
                              FicheDePoste.numero as fiche_numero,
                              OffreDePoste.etat,
                              OffreDePoste.date_validite,
                              OffreDePoste.nb_piece,
                              OffreDePoste.liste_piece,
                              FicheDePoste.status,
                              FicheDePoste.responsable,
                              FicheDePoste.type_metier,
                              FicheDePoste.lieu,
                              FicheDePoste.teletravail,
                              FicheDePoste.nb_heures,
                              FicheDePoste.salaire,
                              FicheDePoste.description,
                              FicheDePoste.siren,
                              Organisation.nom,
                              Organisation.type,
                              Organisation.siege
                       FROM ${OfferRepository.tableName}
                                LEFT JOIN FicheDePoste ON OffreDePoste.fiche = FicheDePoste.numero
                                INNER JOIN Organisation ON Organisation.siren = FicheDePoste.siren`;
        let params: (string | number | undefined)[] = [];
        if (filterOffer) {
            query += ` WHERE FicheDePoste.salaire >= ?`;
            params.push(filterOffer.minSalary);
            if (filterOffer.region) {
                query += ` AND FicheDePoste.lieu = ?`;
                params.push(filterOffer.region);
            }
        }
        return new Promise<[OffreDePoste]>(
            (resolve, reject) =>
                pool.query(query, params, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    let ficheDePoste;
                    let organisation;
                    for (let i = 0; i < result.length; i++) {
                        organisation = new Organisation(result[i].siren, result[i].nom, result[i].type, result[i].siege);
                        ficheDePoste = new FicheDePoste(result[i].fiche_numero, result[i].status, result[i].responsable, result[i].type_metier, result[i].lieu, result[i].teletravail, result[i].nb_heures, result[i].salaire, result[i].description, result[i].siren, organisation);
                        result[i] = new OffreDePoste(result[i].offre_numero, result[i].etat, result[i].date_validite, result[i].nb_piece, result[i].liste_piece, ficheDePoste);
                    }
                        return resolve(result);
                    }
                )
        )
            ;
    }

    static getById(id: number): Promise<OffreDePoste> {
        const query = `SELECT *
                       FROM ${OfferRepository.tableName}
                                LEFT JOIN FicheDePoste ON FicheDePoste.numero = OffreDePoste.fiche
                                INNER JOIN Organisation ON Organisation.siren = FicheDePoste.siren
                       WHERE OffreDePoste.numero = ?`;
        return new Promise<OffreDePoste>(
            (resolve, reject) => {
                pool.query(query, id, (err, result) => {

                        if (result.length == 0 || err) {
                            return reject("Not found");
                        }
                        result[0].date_validite = new Date(result[0].date_validite).toLocaleDateString('fr-FR')

                        let organisation = new Organisation(result[0].siren, result[0].nom, result[0].type, result[0].siege);
                        let ficheDePoste = new FicheDePoste(result[0].fiche, result[0].status, result[0].responsable, result[0].type_metier, result[0].lieu, result[0].teletravail, result[0].nb_heures, result[0].salaire, result[0].description, result[0].siren, organisation);
                        let offer = new OffreDePoste(result[0].numero, result[0].etat, result[0].date_validite, result[0].nb_piece, result[0].liste_piece, ficheDePoste);
                        return resolve(offer);
                    }
                )
            }
        );
    }


    static create(entity: OffreDePoste): Promise<OffreDePoste> {
        const query = `INSERT INTO ${OfferRepository.tableName} (etat, date_validite, nb_piece, liste_piece, fiche)
                       VALUES (?, ?, ?, ?, ?)`;
        return new Promise<OffreDePoste>((resolve, reject) => {
            pool.query(query, [entity.etat, entity.dateValidite, entity.nbPiece, entity.listePiece, entity.ficheDePoste.id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                entity.numero = result.insertId;
                return resolve(entity);
            });
        });
    }

    static getBySiren(siren: string): Promise<OffreDePoste[]> {
        const query = `SELECT *
                       FROM ${OfferRepository.tableName}
                                LEFT JOIN FicheDePoste ON FicheDePoste.numero = OffreDePoste.fiche
                                LEFT JOIN Organisation O on FicheDePoste.siren = O.siren
                       WHERE FicheDePoste.siren = ?`;
        return new Promise<OffreDePoste[]>(
            (resolve, reject) => {
                pool.query(query, siren, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    let offers: OffreDePoste[] = [];
                    for (let i = 0; i < result.length; i++) {
                        let organisation = new Organisation(result[i].siren, result[i].nom, result[i].type, result[i].siege);
                        let ficheDePoste = new FicheDePoste(result[i].fiche, result[i].status, result[i].responsable, result[i].type_metier, result[i].lieu, result[i].teletravail, result[i].nbheure, result[i].salaire, result[i].description, result[i].siren, organisation);
                        let offer = new OffreDePoste(result[i].numero, result[i].etat, result[i].date_validite, result[i].nb_piece, result[i].liste_piece, ficheDePoste);
                        offers.push(offer);
                    }
                    return resolve(offers);
                });
            });

    }

    static update(offre: OffreDePoste): Promise<OffreDePoste> {
        const query = `UPDATE OffreDePoste
                       SET  etat = ?,
                            date_validite = ?,
                            nb_piece = ?,
                            liste_piece = ?
                       WHERE numero = ?`;
        return new Promise<OffreDePoste>(
            (resolve, reject) => {
                pool.query(query, [offre.etat, offre.dateValidite, offre.nbPiece, offre.listePiece, offre.numero], (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                });
            });
    }

    static supprimer(id: number): Promise<boolean> {
        const query = `DELETE FROM OffreDePoste
                       WHERE numero = ?`;
        return new Promise<boolean>(
            (resolve, reject) => {
                pool.query(query, [id], (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                });
            });
    }

}
