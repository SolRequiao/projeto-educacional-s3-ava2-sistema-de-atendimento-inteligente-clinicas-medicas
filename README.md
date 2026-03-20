# 🏥 Sistema de Atendimento Inteligente para Clínicas Médicas

Aplicação web completa para gerenciamento de consultas médicas, com
autenticação segura, integração com APIs externas e painel
administrativo.

------------------------------------------------------------------------

## 📌 Visão Geral

Este projeto foi desenvolvido com o objetivo de informatizar o processo
de agendamento de consultas em clínicas médicas de pequeno porte,
oferecendo:

-   Cadastro e login seguro (JWT)
-   Agendamento de consultas com validação de horário
-   Consulta automática de endereço via CEP (ViaCEP)
-   Integração com API de clima (OpenWeather)
-   Painel administrativo para gerenciamento
-   Aplicação containerizada com Docker

------------------------------------------------------------------------

## 🧱 Arquitetura do Projeto

clinica-inteligente/ ├── backend/ ├── frontend/ ├── docker-compose.yml
└── README.md

------------------------------------------------------------------------

## 🚀 Tecnologias Utilizadas

### [Backend](backend/README.md)
#### [Acesse o README do Backend](backend/README.md)

-   Node.js 24
-   Express
-   MongoDB (Mongoose)
-   JWT
-   bcrypt
-   Axios

### [Frontend](frontend/README.md)
#### [Acesse o README do Frontend](frontend/README.md)

-   Vue 3
-   Vite
-   Pinia
-   Axios
-   Vue Router

### Infraestrutura

-   Docker
-   Docker Compose

------------------------------------------------------------------------

## 🔗 Documentações Específicas

-   Backend → ./backend/README.md
-   Frontend → ./frontend/README.md

------------------------------------------------------------------------

## ⚙️ Como Executar (Docker)

### 1. Clonar projeto

git clone https://github.com/seu-usuario/clinica-inteligente.git cd
clinica-inteligente

### 2. Configurar backend
*(neste caso deste projeto por se tratar de um projeto academico, o .env ja esta configurado)*

cd backend cp .env.example .env


Editar .env:

PORT=3000 
MONGO_URI=mongodb://mongodb:27017/clinica
JWT_SECRET=sua_chave_super_secreta OPENWEATHER_API_KEY=sua_api_key

### 3. Configurar frontend

cd ../frontend cp .env.example .env

Editar:

VITE_API_URL=http://localhost:3000/api

### 4. Rodar sistema

cd .. docker compose up --build

------------------------------------------------------------------------

## 🌐 Acessos

Frontend: http://localhost:5173\
Backend: http://localhost:3000\
MongoDB: localhost:27017

------------------------------------------------------------------------

## 🔐 Segurança

-   JWT
-   bcrypt
-   Rotas protegidas
-   Variáveis de ambiente

------------------------------------------------------------------------

## 📌 Funcionalidades

-   Cadastro e login
-   Agendamento
-   CEP automático
-   Clima integrado
-   Painel admin

------------------------------------------------------------------------

## 📚 Autor

Sol Requião Falcão
