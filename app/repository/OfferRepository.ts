import {Offer} from "../entity/Offer";
import {pool} from "../database";
import {FicheDePoste} from "../entity/FicheDePoste";

export class OfferRepository {
    static tableName = "OffreDePoste";

    static getAll(): Promise<[Offer]> {
        const query = `SELECT * FROM ${OfferRepository.tableName} LEFT JOIN FicheDePoste ON FicheDePoste.numero = OffreDePoste.fiche`;
        return new Promise<[Offer]>(
            (resolve, reject) =>
                pool.query(query, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        let ficheDePoste;
                        for (let i = 0; i < result.length; i++) {
                            ficheDePoste = new FicheDePoste(result[i].fiche, result[i].status, result[i].responsable, result[i].type_metier, result[i].lieu, result[i].teletravail, result[i].nbheure, result[i].salaire, result[i].description, result[i].siren);
                            result[i] = new Offer(result[i].numero, result[i].etat, result[i].date_validite, result[i].nb_piece, result[i].liste_piece, ficheDePoste);
                        }
                        resolve(result);
                    }
                )
        )
            ;
    }

    getById(id: number): Promise<null> {
        throw new Error("Method not implemented.");
    }

    create(entity: Offer): Promise<Offer> {
        throw new Error("Method not implemented.");
    }

    update(id: number, entity: Offer): Promise<Offer | null> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}