import {Offre} from "../entity/Offre";
import {pool} from "../database";
import {FicheDePoste} from "../entity/FicheDePoste";

export class OfferRepository {
    static tableName = "OffreDePoste";

    static getAll(): Promise<[Offre]> {
        const query = `SELECT *
                       FROM ${OfferRepository.tableName}
                                LEFT JOIN FicheDePoste ON FicheDePoste.numero = OffreDePoste.fiche`;
        return new Promise<[Offre]>(
            (resolve, reject) =>
                pool.query(query, (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        let ficheDePoste;
                        for (let i = 0; i < result.length; i++) {
                            ficheDePoste = new FicheDePoste(result[i].fiche, result[i].status, result[i].responsable, result[i].type_metier, result[i].lieu, result[i].teletravail, result[i].nb_heures, result[i].salaire, result[i].description, result[i].siren);
                            result[i] = new Offre(result[i].numero, result[i].etat, result[i].date_validite, result[i].nb_piece, result[i].liste_piece, ficheDePoste);
                        }
                        return resolve(result);
                    }
                )
        )
            ;
    }

    static getById(id: number): Promise<Offre> {
        const query = `SELECT *
                       FROM ${OfferRepository.tableName}
                                LEFT JOIN FicheDePoste ON FicheDePoste.numero = OffreDePoste.fiche
                       WHERE OffreDePoste.numero = ?`;
        return new Promise<Offre>(
            (resolve, reject) => {
                pool.query(query, id, (err, result) => {

                        if (result.length == 0 || err) {
                            return reject("Not found");
                        }
                        let ficheDePoste = new FicheDePoste(result[0].fiche, result[0].status, result[0].responsable, result[0].type_metier, result[0].lieu, result[0].teletravail, result[0].nbheure, result[0].salaire, result[0].description, result[0].siren);
                        let offer = new Offre(result[0].numero, result[0].etat, result[0].date_validite, result[0].nb_piece, result[0].liste_piece, ficheDePoste);
                        return resolve(offer);


                    }
                )

            }
        );
    }

    create(entity: Offre): Promise<Offre> {
        throw new Error("Method not implemented.");
    }

    update(id: number, entity: Offre): Promise<Offre | null> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}