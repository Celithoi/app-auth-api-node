// src/database.js
const { Pool } = require('pg');
require('dotenv').config();

// Cria um novo pool de conexões usando as variáveis de ambiente
const pool = new Pool({
  user: process.env.DB_USER_PG,
  host: process.env.DB_HOST_PG,
  database: process.env.DB_NAME_PG,
  password: process.env.DB_PASSWORD_PG,
  port: process.env.DB_PORT_PG,
});

// Evento para verificar se a conexão foi bem-sucedida
pool.on('connect', () => {
  console.log(
    'Conexão com o banco de dados PostgreSQL estabelecida com sucesso!',
  );
});

// Evento para capturar erros de conexão
pool.on('error', (err, client) => {
  console.error('Erro inesperado no cliente do pool de banco de dados', err);
  process.exit(-1);
});

// Exporta um método 'query' que poderemos usar em outras partes da nossa aplicação
module.exports = {
  query: (text, params) => pool.query(text, params),
};
