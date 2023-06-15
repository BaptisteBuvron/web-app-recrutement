//implement all the methods of the interface
import {FicheDePoste} from "../entity/FicheDePoste";
import {pool} from "../database";
import {Organisation} from "../entity/Organisation";

export class FicheDePosteRepository {
    static create(entity: FicheDePoste): Promise<FicheDePoste> {
        const query = `INSERT INTO FicheDePoste (status, responsable, type_metier, lieu, teletravail, nb_heures, salaire, description, siren) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        return new Promise<FicheDePoste>((resolve, reject) => {
            pool.query(query, [entity.status, entity.responsable, entity.typeMetier, entity.lieu, entity.teletravail, entity.nbHeures, entity.salaire, entity.description, entity.siren], (err, result) => {
                if (err) {
                    return reject(err);
                }
                entity.id = result.insertId;
                return resolve(entity);
            });
        });
    }

    delete(id: number): Promise<boolean> {
        return Promise.resolve(false);
    }

    static getAll(): Promise<FicheDePoste[]> {
        const query = `SELECT *
                       FROM FicheDePoste
                       INNER JOIN Organisation ON Organisation.siren = FicheDePoste.siren
        `;
        return new Promise<FicheDePoste[]>((resolve, reject) => {
            pool.query(query, (err, result) => {
                if (err) {
                    return reject(err);
                }
                let ficheDePostes: FicheDePoste[] = [];
                for (let i = 0; i < result.length; i++) {
                    let organisation = new Organisation(result[0].siren, result[0].nom, result[0].type, result[0].siege);
                    ficheDePostes.push(new FicheDePoste(result[i].numero, result[i].status, result[i].responsable, result[i].type_metier, result[i].lieu, result[i].teletravail, result[i].nb_heures, result[i].salaire, result[i].description, result[i].siren, organisation));
                }
                return resolve(ficheDePostes);
            });
        });
    }

    static getById(id: number): Promise<FicheDePoste> {
        const query = `SELECT *
                       FROM FicheDePoste
                       WHERE numero = ?`;
        return new Promise<FicheDePoste>((resolve, reject) => {
            pool.query(query, id, (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.length == 0) {
                    return reject(null);
                }
                let organisation = new Organisation(result[0].siren, result[0].nom, result[0].type, result[0].siege);
                let ficheDePoste = new FicheDePoste(result[0].numero, result[0].status, result[0].responsable, result[0].type_metier, result[0].lieu, result[0].teletravail, result[0].nb_heures, result[0].salaire, result[0].description, result[0].siren, organisation);
                return resolve(ficheDePoste);
            });
        });
    }

    static getBySiren(siren: string): Promise<FicheDePoste[]> {
        const query = `SELECT *
                       FROM FicheDePoste
                       WHERE siren = ?`;
        return new Promise<FicheDePoste[]>((resolve, reject) => {
            pool.query(query, siren, (err, result) => {
                if (err) {
                    return reject(err);
                }
                let ficheDePostes: FicheDePoste[] = [];
                for (let i = 0; i < result.length; i++) {
                    ficheDePostes.push(new FicheDePoste(result[i].numero, result[i].status, result[i].responsable, result[i].type_metier, result[i].lieu, result[i].teletravail, result[i].nb_heures, result[i].salaire, result[i].description, result[i].siren));
                }
                return resolve(ficheDePostes);
            });
        });
    }

    static getDistinctRegion(): Promise<string[]> {
        const query = `SELECT DISTINCT lieu
                       FROM FicheDePoste`;
        return new Promise<string[]>((resolve, reject) => {
            pool.query(query, (err, result) => {
                if (err) {
                    return reject(err);
                }
                let regions: string[] = [];
                for (let i = 0; i < result.length; i++) {
                    regions.push(result[i].lieu);
                }
                return resolve(regions);
            });
        });
    }

    update(id: number, entity: FicheDePoste): Promise<FicheDePoste | null> {
        throw new Error("Method not implemented.");
    }

}
