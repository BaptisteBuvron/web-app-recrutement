//implement all the methods of the interface
import {Organisation} from "../entity/Organisation";
import {pool} from "../database";

export class OrganisationRepository {
    static tableName = "Organisation";

    static create(entity: Organisation): Promise<Organisation> {
        const query = `INSERT INTO Organisation (siren, nom, type, siege) VALUES (?, ?, ?, ?)`;
        return new Promise<Organisation>((resolve, reject) => {
            pool.query(query, [entity.siren, entity.nom, entity.type, entity.siege], (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }

    static getAll(): Promise<[Organisation]> {
        const query = `SELECT nom, siren
                       FROM ${OrganisationRepository.tableName}`;
        return new Promise<[Organisation]>(
            (resolve, reject) =>
                pool.query(query, (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(result);
                    }
                )
        );
        //Modifier la table utilisateur : profil recruteur et siren à mettre à jour
    }
}
