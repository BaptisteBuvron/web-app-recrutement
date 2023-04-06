import {Offer} from "../entity/Offer";
import {pool} from "../database";

export class OfferRepository
{
static tableName = "OffreDePoste";
    static getAll(): Promise<[Offer]> {
        const query = `SELECT *
                       FROM ${OfferRepository.tableName}`;
        return new Promise<[Offer]>(
            (resolve, reject) =>
                pool.query(query, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        for (let i = 0; i < result.length; i++) {
                            result[i] = new Offer(result[i].numero, result[i].etat, result[i].date_validite, result[i].nb_piece, result[i].liste_piece, result[i].siren, result[i].ficheDePoste);
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