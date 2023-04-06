import * as mysql from 'mysql';
import dotenv from "dotenv";

dotenv.config({path: '.env'});


//Get the connection details from the environment variables
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

export const pool: mysql.Pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
});

