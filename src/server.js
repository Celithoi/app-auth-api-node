// src/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./database'); // Importa nosso módulo de banco de dados

const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('<h1>API do Novo App está no ar! 🚀</h1><p>Backend conectado com sucesso!</p>');
});

// Nova rota para testar o banco de dados
app.get('/db-test', async (req, res) => {
  try {
    // Faz uma consulta simples ao banco para pegar a hora atual
    const { rows } = await db.query('SELECT NOW()');
    res.json({
      message: 'Conexão com o banco de dados bem-sucedida!',
      databaseTime: rows[0].now,
    });
  } catch (err) {
    console.error('Erro ao conectar com o banco de dados:', err);
    res.status(500).json({ error: 'Não foi possível conectar ao banco de dados.' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  // Pequeno teste de conexão ao iniciar o servidor
  db.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Falha ao conectar com o PostgreSQL ao iniciar.', err.stack);
    } else {
      console.log('Conexão com PostgreSQL verificada ao iniciar. Hora do banco:', res.rows[0].now);
    }
  });
});
