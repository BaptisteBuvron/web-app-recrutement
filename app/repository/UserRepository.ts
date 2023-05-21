import {IRepository} from "./IRepository";
import {User} from "../entity/User";
import {pool} from "../database";
import {OrganisationRepository} from "./OrganisationRepository";

const db = pool;

export class UserRepository implements IRepository<User> {
    static tableName = "Utilisateur";

    static getRecruiterDemand(): Promise<[User]> {
        const query = `SELECT u.email, u.nom, u.prenom, o.siren, o.nom as organisation
                       FROM ${UserRepository.tableName} u
                                INNER JOIN ${OrganisationRepository.tableName} o using (siren)`;
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
                       FROM ${UserRepository.tableName} u INNER JOIN ${OrganisationRepository.tableName} o using(siren)
                       WHERE u.demande_organisation = 'En cours'`;
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
        const query = `UPDATE ${UserRepository.tableName} SET demande_organisation = 'accepted', type='Recruteur' WHERE email=?`;
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


    static setDemandRefused(mail:string): Promise<[User]> {
        const query = `UPDATE ${UserRepository.tableName} SET demande_organisation = 'refused', type='Candidat', siren=null WHERE mail=?`;
        return new Promise<[User]>(
            (resolve, reject) =>
                pool.query(query, [mail], (err, result) => {
                        if (err) {
                            throw err;
                        }
                        let users: User[] = [];
                        for (let i = 0; i < result.length; i++) {
                            users.push(new User(
                                result[i].email,
                                result[i].nom,
                                result[i].prenom,
                                result[i].telephone,
                                result[i].date_creation,
                                result[i].statut,
                                result[i].password,
                                result[i].role,
                                result[i].demande_organisation,
                                result[i].siren));
                        }
                        resolve(users);
                    }
                );
            }
        );

    }

    static setSiren(siren:string, mail:string): Promise<[User]> {
        const query = `UPDATE ${UserRepository.tableName} SET demande_organisation = 'En cours', siren = ? WHERE mail=?`;
        return new Promise<[User]>(
            (resolve, reject) =>
                pool.query(query, [siren, mail], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(result);
                    }
                )
        );
    }
}
