import {OffreDePoste} from "../entity/OffreDePoste";
import {pool} from "../database";
import {FicheDePoste} from "../entity/FicheDePoste";

export class OfferRepository {
    static tableName = "OffreDePoste";

    static getAll(): Promise<[OffreDePoste]> {
        const query = `SELECT OffreDePoste.numero as offre_numero,
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
                              FicheDePoste.siren
                       FROM ${OfferRepository.tableName}
                                LEFT JOIN FicheDePoste ON OffreDePoste.fiche = FicheDePoste.numero`;
        return new Promise<[OffreDePoste]>(
            (resolve, reject) =>
                pool.query(query, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    let ficheDePoste;
                    for (let i = 0; i < result.length; i++) {
                        ficheDePoste = new FicheDePoste(result[i].fiche_numero, result[i].status, result[i].responsable, result[i].type_metier, result[i].lieu, result[i].teletravail, result[i].nb_heures, result[i].salaire, result[i].description, result[i].siren);
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
                       WHERE OffreDePoste.numero = ?`;
        return new Promise<OffreDePoste>(
            (resolve, reject) => {
                pool.query(query, id, (err, result) => {

                        if (result.length == 0 || err) {
                            return reject("Not found");
                        }
                        let ficheDePoste = new FicheDePoste(result[0].fiche, result[0].status, result[0].responsable, result[0].type_metier, result[0].lieu, result[0].teletravail, result[0].nbheure, result[0].salaire, result[0].description, result[0].siren);
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

    update(id: number, entity: OffreDePoste): Promise<OffreDePoste | null> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}