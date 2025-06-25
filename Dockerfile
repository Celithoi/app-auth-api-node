# Estágio 1: Use uma imagem oficial do Node.js como base
FROM node:18-alpine

# Crie e defina o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copie os arquivos de definição de dependências primeiro
# Isso aproveita o cache do Docker. Ele só reinstala as dependências se o package.json mudar.
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o resto do código da nossa aplicação para o diretório de trabalho
COPY . .

# Expõe a porta que a nossa aplicação vai rodar (puxada do .env)
# O valor padrão será 5000, conforme nosso .env
EXPOSE ${PORT}

# Comando para iniciar a aplicação usando nodemon (ótimo para desenvolvimento)
CMD [ "npx", "nodemon", "src/server.js" ]
