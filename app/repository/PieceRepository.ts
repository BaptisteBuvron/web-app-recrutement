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

    static getByCandidature(email: string, number: number): Promise<Piece[]> {
        const query = `SELECT *
                       FROM Piece
                       WHERE candidat = ?
                         AND offre = ?`;
        return new Promise<Piece[]>((resolve, reject) => {
            pool.query(query, [email, number], (err, result) => {
                if (err) {
                    return reject(err);
                }
                let pieces: Piece[] = [];
                for (let row of result) {
                    let piece: Piece = new Piece(row.nom, row.url, row.candidat, row.offre, row.id);
                    pieces.push(piece);
                }
                return resolve(pieces);
            });
        });
    }

    static getById(id: number): Promise<Piece> {
        const query = `SELECT *
                       FROM Piece
                       WHERE id = ?`;
        return new Promise<Piece>((resolve, reject) => {
            pool.query(query, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                let row = result[0];
                let piece: Piece = new Piece(row.nom, row.url, row.candidat, row.offre, row.id);
                return resolve(piece);
            });
        });
    }


}