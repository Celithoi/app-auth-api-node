const bcrypt = require('bcryptjs');
const db = require('../database');

// Criamos um objeto para agrupar nossas funções de controller
const userController = {
  // A função para registrar um usuário. async/await é essencial aqui.
  async register(req, res) {
    try {
      // 1. EXTRAIR DADOS DO CORPO DA REQUISIÇÃO
      // 'req.body' é onde o Postman vai nos enviar o JSON com os dados.
      const { username, email, password } = req.body;

      // 2. VALIDAR SE OS DADOS VIERAM

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: 'Campos obrigatórios não preenchidos.' });
      }

      // 3. VERIFICAR SE O USUÁRIO JÁ EXISTE
      // Usamos '$1' e '$2' para prevenir SQL Injection.
      const { rows: existingUsers } = await db.query(
        'SELECT id FROM users WHERE username = $1 or email = $2',
        [username, email],
      );

      if (existingUsers.length > 0) {
        // HTTP 409: Conflict (Conflito, pois o recurso já existe)
        return res.status(409).json({ error: 'Usuário já existe.' });
      }
      // 4. CRIPTOGRAFAR A SENHA
      // '10' é o "fator de trabalho" da criptografia. Um bom valor padrão.
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      // 5. INSERIR O NOVO USUÁRIO NO BANCO
      // 'RETURNING *' nos devolve todos os dados do usuário recém-criado.
      // É uma boa prática não retornar o hash da senha.
      const { rows: newUser } = await db.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, passwordHash],
      );
      // 6. ENVIAR RESPOSTA DE SUCESSO
      // HTTP 201: Created (Recurso criado com sucesso)
      return res
        .status(201)
        .json({ message: 'Usuário registrado com sucesso!', user: newUser[0] });
    } catch (err) {
      console.error('Erro no registro do usuário:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },
  // Futuramente, aqui virá a função de login
  // async login(req, res) { ... }
};
// Exportamos o controller para que as rotas possam usá-lo
module.exports = userController;
