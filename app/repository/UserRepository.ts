import {IRepository} from "./IRepository";
import {User} from "../entity/User";
import {pool} from "../database";
import {OrganisationRepository} from "./OrganisationRepository";

const db = pool;

export class UserRepository implements IRepository<User> {
    static tableName = "Utilisateur";

    getAll(): Promise<[User]> {
        const query = `SELECT *
                       FROM ${UserRepository.tableName}`;
        return new Promise<[User]>(
            (resolve, reject) =>

                db.query(query, (err, result) => {
                        if (err) {
                            throw err;
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

    create(entity: User): Promise<User> {
        throw new Error("Method not implemented.");
    }

    update(id: number, entity: User): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    static getRecruiterDemand(): Promise<[User]> {
        const query = `SELECT u.mail, u.nom, u.prenom, o.siren, o.nom  as organisation
                       FROM ${UserRepository.tableName} u INNER JOIN ${OrganisationRepository.tableName} o using(siren)`;
        return new Promise<[User]>(
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

    static setDemandAccepted(mail:string): Promise<[User]> {
        const query = `UPDATE ${UserRepository.tableName} SET demande_organisation = 'accepté', type='Recruteur' WHERE mail=?`;
        return new Promise<[User]>(
            (resolve, reject) =>
                pool.query(query, [mail], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(result);
                    }
                )
        );
    }

    static setDemandRefused(mail:string): Promise<[User]> {
        const query = `UPDATE ${UserRepository.tableName} SET demande_organisation = 'refusé', type='Candidat', siren=null WHERE mail=?`;
        return new Promise<[User]>(
            (resolve, reject) =>
                pool.query(query, [mail], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(result);
                    }
                )
        );
    }
}
