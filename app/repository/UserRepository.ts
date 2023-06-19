import {User} from "../entity/User";
import {pool} from "../database";
import {OrganisationRepository} from "./OrganisationRepository";
import {Organisation} from "../entity/Organisation";

const db = pool;

export class UserRepository {
    static tableName = "Utilisateur";

    static getById(email:string): Promise<[User]> {
        const query = `SELECT u.email, u.nom, u.prenom, u.telephone, u.date_creation, u.statut, u.password, u.role, u.demande_organisation, o.siren, o.nom as organisation, o.type, o.siege
                       FROM ${UserRepository.tableName} u INNER JOIN ${OrganisationRepository.tableName} o using (siren)
                       WHERE u.email = ?`;
        return new Promise<[User]>(
            (resolve, reject) =>
                pool.query(query,[email], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                    if(result[0]){
                        console.log(result[0]);
                        let organisation = new Organisation(result[0].siren, result[0].organisation, result[0].type, result[0].siege);
                        result[0].organisation = organisation;
                        console.log(result);
                    }
                        return resolve(result);
                    }
                )
        );
    }

    static getAll(): Promise<[User]> {
        const query = `SELECT email, nom, prenom, telephone, date_creation, statut, role, demande_organisation, siren
                       FROM ${UserRepository.tableName}`;
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
    }

    static create(entity: User): Promise<User> {
        const query = `INSERT INTO ${UserRepository.tableName} (email, nom, prenom, telephone, date_creation, statut, password, role, demande_organisation, siren) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        return new Promise<User>((resolve, reject) => {
            pool.query(query, [entity.email, entity.nom, entity.prenom, entity.telephone, entity.dateCreation, entity.statut, entity.passwordHash, entity.role, entity.demande_organisation, entity.organisation?.siren], (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }

    update(id: number, entity: User): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }


    static getRecruiterDemand(): Promise<[User]> {
        const query = `SELECT u.email, u.nom, u.prenom, o.siren, o.nom as organisation, o.type, o.siege
                       FROM ${UserRepository.tableName} u
                                INNER JOIN ${OrganisationRepository.tableName} o using (siren)
                       WHERE u.demande_organisation = 'En cours'`;
        return new Promise<[User]>(
            (resolve, reject) =>
                pool.query(query, (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        if(result[0]){
                            console.log(result[0]);
                            let organisation = new Organisation(result[0].siren, result[0].organisation, result[0].type, result[0].siege);
                            result[0].organisation = organisation;
                            console.log(result);
                        }
                        return resolve(result);
                    }
                )
        );
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
