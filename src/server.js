/* eslint-disable no-console */
// src/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./database'); // Importa nosso módulo de banco de dados
const userRoutes = require('./routes/userRoutes');

const app = express();

// ==========================================================
// Os "Middlewares" (Regras de Trânsito)
// ==========================================================
// Configurações do Express
// Permite requisições de qualquer origem (CORS)

app.use(cors());
app.use(express.json());

// ==========================================================
// REGISTRA AS ROTAS DA API
// ==========================================================
// Diz ao Express para usar o arquivo userRoutes para qualquer
// requisição que comece com o prefixo '/api/users'

app.use('/api/users', userRoutes);

// Rota de teste

app.get('/', (req, res) => {
  res.send(
    '<h1>API do Novo App está no ar! 🚀</h1><p>Backend conectado com sucesso!</p>',
  );
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
    res
      .status(500)
      .json({ error: 'Não foi possível conectar ao banco de dados.' });
  }
});

// ROTA PARA INICIAR O BANCO DE DADOS

app.get('/init-db', async (req, res) => {
  try {
    // Constrói o caminho completo para o arquivo init.sql
    const sqlFilePath = path.join(__dirname, 'sql', 'init.sql');
    // Lê o conteúdo do arquivo
    const initSql = fs.readFileSync(sqlFilePath, 'utf8');
    // Executa o script SQL no banco de dados
    await db.query(initSql);
    res.status(200).json({
      message:
        'Banco de ddos inicializado com sucesso!Tabela "users" criada (se não existia).',
    });
  } catch (error) {
    // Em caso de erro, loga no console e envia uma resposta de erro
    console.error('Erro ao inicializar o banco de dados:', error);
    res.status(500).json({ error: 'Falha ao inicializar o banco de dados.' });
  }
});

// ==========================================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  // Pequeno teste de conexão ao iniciar o servidor
  db.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error(
        'Falha ao conectar com o PostgreSQL ao iniciar.',
        err.stack,
      );
    } else {
      console.log(
        'Conexão com PostgreSQL verificada ao iniciar. Hora do banco:',
        res.rows[0].now,
      );
    }
  });
});
