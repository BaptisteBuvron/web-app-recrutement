import {User} from "../entity/User";
import {pool} from "../database";
import {OrganisationRepository} from "./OrganisationRepository";

const db = pool;

export class UserRepository {
    static tableName = "Utilisateur";

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
        const query = `SELECT u.email, u.nom, u.prenom, o.siren, o.nom as organisation
                       FROM ${UserRepository.tableName} u
                                INNER JOIN ${OrganisationRepository.tableName} o using (siren)
                       WHERE u.demande_organisation = 'En cours'`;
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

    static setDemandAccepted(email: string): Promise<[User]> {
        const query = `UPDATE ${UserRepository.tableName}
                       SET demande_organisation = 'acceptation',
                           role='Recruteur'
                       WHERE email = ?`;
        return new Promise<[User]>(
            (resolve, reject) =>
                pool.query(query, [email], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(result);
                    }
                )
        );
    }

    static setDemandRefused(email: string): Promise<[User]> {
        const query = `UPDATE ${UserRepository.tableName}
                       SET demande_organisation = 'refus',
                           role='Candidat',
                           siren=null
                       WHERE email = ?`;
        return new Promise<[User]>(
            (resolve, reject) =>
                pool.query(query, [email], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(result);
                    }
                )
        );
    }

    static setSiren(siren: string, email: string): Promise<[User]> {
        const query = `UPDATE ${UserRepository.tableName}
                       SET demande_organisation = 'En cours',
                           siren                = ?
                       WHERE email = ?`;
        return new Promise<[User]>(
            (resolve, reject) =>
                pool.query(query, [siren, email], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(result);
                    }
                )
        );
    }
}
