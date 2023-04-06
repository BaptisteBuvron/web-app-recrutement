import {IRepository} from "./IRepository";
import {User} from "../entity/User";
import {pool} from "../database";

const db = pool;

export class UserRepository implements IRepository<User> {
    static tableName = "User";

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

}