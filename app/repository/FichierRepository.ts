import {Piece} from "../entity/Piece";
import {pool} from "../database";

export class PieceRepository {
    static create(fichier: Piece): Promise<Piece> {
        const query = `INSERT INTO Piece (nom, url, candidat, offre)
                       VALUES (?, ?, ?, ?)`;
        return new Promise<Piece>((resolve, reject) => {
                pool.query(query, [fichier.nom, fichier.url, fichier.candidat.email, fichier.offre.numero], (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    fichier.id = result.insertId;
                    return resolve(fichier);
                });
            }
        );
    }


}