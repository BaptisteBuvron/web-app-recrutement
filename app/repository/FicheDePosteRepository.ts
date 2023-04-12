//implement all the methods of the interface
import {FicheDePoste} from "../entity/FicheDePoste";
import {pool} from "../database";

export class FicheDePosteRepository {
    static create(entity: FicheDePoste): Promise<FicheDePoste> {
        const query = `INSERT INTO FicheDePoste (status, responsable, type_metier, lieu, teletravail, nb_heures, salaire, description, siren) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        return new Promise<FicheDePoste>((resolve, reject) => {
            pool.query(query, [entity.status, entity.responsable, entity.typeMetier, entity.lieu, entity.teletravail, entity.nbHeures, entity.salaire, entity.description, entity.siren], (err, result) => {
                if (err) {
                    return reject(err);
                }
                entity.id = result.insertId;
                console.log(entity);
                return resolve(entity);
            });
        });
    }

    delete(id: number): Promise<boolean> {
        return Promise.resolve(false);
    }

    getAll(): Promise<FicheDePoste[]> {
        return Promise.resolve([]);
    }

    getById(id: number): Promise<FicheDePoste | null> {
        throw new Error("Method not implemented.");
    }

    update(id: number, entity: FicheDePoste): Promise<FicheDePoste | null> {
        throw new Error("Method not implemented.");
    }

}