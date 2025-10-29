import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

//configuração e conexão com o DB
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    //port: parseInt(process.env.DB_PORT || '5432'),
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro ao conectar com o banco', err);
    } else {
        console.log('Banco de dados conectado', res.rows[0].now);
    }
});

export default {
    query: (text, params) => pool.query(text, params),
};