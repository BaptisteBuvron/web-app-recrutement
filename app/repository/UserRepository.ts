import {User} from "../entity/User";
import {pool} from "../database";
import {OrganisationRepository} from "./OrganisationRepository";
import {Organisation} from "../entity/Organisation";

const db = pool;

export class UserRepository {
    static tableName = "Utilisateur";

    static getById(email: string): Promise<User> {
        const query = `SELECT u.email,
                              u.nom,
                              u.prenom,
                              u.telephone,
                              DATE_FORMAT(u.date_creation, '%d-%m-%Y') as date_creation,
                              u.statut,
                              u.password,
                              u.role,
                              u.demande_organisation,
                              o.siren,
                              o.nom                                    as organisation,
                              o.type,
                              o.siege
                       FROM ${UserRepository.tableName} u
                                LEFT JOIN ${OrganisationRepository.tableName} o using (siren)
                       WHERE u.email = ?`;
        return new Promise<User>(
            (resolve, reject) =>
                pool.query(query, [email], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        if (result.length === 0) {
                            return reject(new Error("User not found"));
                        }
                        let organisation = new Organisation(
                            result[0].siren,
                            result[0].organisation,
                            result[0].type,
                            result[0].siege
                        );
                        let user = new User(
                            result[0].email,
                            result[0].nom,
                            result[0].prenom,
                            result[0].telephone,
                            result[0].date_creation,
                            result[0].statut,
                            result[0].password,
                            result[0].role,
                            result[0].demande_organisation,
                            organisation,
                            undefined
                        );

                        return resolve(user);
                    }
                )
        );
    }

    static getAll(): Promise<[User]> {
        const query = `SELECT u.email,
                              u.nom,
                              u.prenom,
                              u.telephone,
                              DATE_FORMAT(u.date_creation, '%d-%m-%Y') as date_creation,
                              u.statut,
                              u.password,
                              u.role,
                              u.demande_organisation,
                              o.siren,
                              o.nom                                    as organisation,
                              o.type,
                              o.siege
                       FROM ${UserRepository.tableName} u
                                LEFT JOIN ${OrganisationRepository.tableName} o using (siren)`;

        return new Promise<[User]>(
            (resolve, reject) =>
                pool.query(query, (err, result) => {
                        if (err) {
                            return reject(err);
                        }

                        let organisation;
                        let user;
                        for (let i = 0; i < result.length; i++) {
                            organisation = new Organisation(
                                result[i].siren,
                                result[i].organisation,
                                result[i].type,
                                result[i].siege
                            );
                            user = new User(
                                result[i].email,
                                result[i].nom,
                                result[i].prenom,
                                result[i].telephone,
                                result[i].date_creation,
                                result[i].statut,
                                result[i].password,
                                result[i].role,
                                result[i].demande_organisation,
                                organisation,
                                undefined
                            );
                            result[i] = user;
                        }

                        return resolve(result);
                    }
                )
        );
    }

    static create(entity: User): Promise<User> {
        const query = `INSERT INTO ${UserRepository.tableName} (email, nom, prenom, telephone, date_creation, statut,
                                                                password, role, demande_organisation, siren)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        return new Promise<User>((resolve, reject) => {
            pool.query(query, [entity.email, entity.nom, entity.prenom, entity.telephone, entity.dateCreation, entity.statut, entity.passwordHash, entity.role, entity.demande_organisation, entity.organisation?.siren], (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }

    static update(user: User): Promise<User> {
        const query = `UPDATE ${UserRepository.tableName}
                       SET nom       = ?,
                           prenom    = ?,
                           telephone = ?,
                           statut    = ?,
                           role      = ?
                       WHERE email = ?`;
        return new Promise<User>(
            (resolve, reject) =>
                pool.query(query, [user.nom, user.prenom, user.telephone, user.statut, user.role, user.email], (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(result);
                    }
                )
        );
    }

    static supprimerUtilisateur(email: string): Promise<User> {
        const query = `DELETE
                       FROM ${UserRepository.tableName}
                       WHERE email = ?`;
        return new Promise<User>(
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

    static getNewRecruiterDemand(): Promise<[User]> {
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
                    if (result[0]) {
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

    static getRecruiterDemand(): Promise<[User]> {
        const query = `SELECT u.email, u.nom, u.prenom, o.siren, o.nom as organisation, o.type, o.siege
                       FROM ${UserRepository.tableName} u
                                INNER JOIN ${OrganisationRepository.tableName} o using (siren)
                       WHERE u.demande_organisation = 'En cours'
                          OR u.demande_organisation = 'refus'
                          OR u.demande_organisation = 'acceptation'`;
        return new Promise<[User]>(
            (resolve, reject) =>
                pool.query(query, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    if (result[0]) {
                        let organisation = new Organisation(result[0].siren, result[0].organisation, result[0].type, result[0].siege);
                        result[0].organisation = organisation;
                    }
                        return resolve(result);
                    }
                )
        );
    }

    static getOldRecruiterDemand(): Promise<[User]> {
        const query = `SELECT u.email,
                              u.nom,
                              u.prenom,
                              u.demande_organisation,
                              o.siren,
                              o.nom as organisation,
                              o.type,
                              o.siege
                       FROM ${UserRepository.tableName} u
                                INNER JOIN ${OrganisationRepository.tableName} o using (siren)
                       WHERE u.demande_organisation = 'refus'
                          OR u.demande_organisation = 'acceptation'`;
        return new Promise<[User]>(
            (resolve, reject) =>
                pool.query(query, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    if (result[0]) {
                        let organisation = new Organisation(result[0].siren, result[0].organisation, result[0].type, result[0].siege);
                        result[0].organisation = organisation;
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
                           role='Candidat'
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
