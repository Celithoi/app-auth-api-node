-- Garante que a extensão para gerar UUIDs esteja disponível.
-- UUIDs são os "random numbers" que usaremos para o ID.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Cria a tabela 'users' somente se ela ainda não existir.
CREATE TABLE IF NOT EXISTS users (
    -- Chave Primária: ID único e automático para cada usuário.
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Nome de usuário: Obrigatório (NOT NULL) e não pode ser repetido (UNIQUE).
    username VARCHAR(50) UNIQUE NOT NULL,

    -- Email: Obrigatório e também único.
    email VARCHAR(255) UNIQUE NOT NULL,

    -- Hash da Senha: Obrigatório. Onde guardaremos a senha criptografada.
    password_hash VARCHAR(255) NOT NULL,

    -- Data de Criação: Preenchido automaticamente quando um usuário é criado.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Um comentário para nos lembrarmos do propósito desta tabela.
COMMENT ON TABLE users IS 'Armazena as informações de registro e credenciais dos usuários.';