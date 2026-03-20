# Backend - Sistema de Atendimento Inteligente para Clínicas Médicas

Backend completo em **Node.js 24 + Express + MongoDB**, com autenticação JWT, integração com **ViaCEP** e **OpenWeather**, pronto para uso com **Docker**.

## Tecnologias

- Node.js 24
- npm 11
- Express
- MongoDB + Mongoose
- JWT
- bcryptjs
- ViaCEP
- OpenWeather
- Docker

## Funcionalidades

- Cadastro de usuários (`patient` e `admin`)
- Login com JWT
- Perfil do usuário autenticado
- Busca automática de endereço por CEP
- Agendamento de consultas
- Verificação de conflito de horário por médico/data/hora
- Alerta de chuva para a data da consulta
- Painel administrativo com indicadores
- Listagem de consultas do paciente e do administrador

## Como rodar localmente

### 1. Instale as dependências

```bash
npm install
```

### 2. Crie o arquivo `.env`

Use como base o `.env.example`.

### 3. Rode a aplicação

```bash
npm run dev
```

## Como rodar com Docker

Exemplo de serviço no `docker-compose.yml` do projeto principal:

```yaml
backend:
  build:
    context: ./backend
  container_name: clinica_backend
  restart: unless-stopped
  ports:
    - "3000:3000"
  depends_on:
    - mongodb
  env_file:
    - ./backend/.env
```

## Endpoints principais

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Usuários
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users/cep/:cep`

### Consultas
- `POST /api/appointments`
- `GET /api/appointments/my`
- `GET /api/appointments`
- `GET /api/appointments/dashboard`
- `PUT /api/appointments/:id`
- `PATCH /api/appointments/:id/status`
- `DELETE /api/appointments/:id`

## Exemplo de registro

```json
{
  "name": "Maria Souza",
  "email": "maria@email.com",
  "password": "123456",
  "role": "patient",
  "phone": "71999999999",
  "cep": "40010000",
  "number": "123"
}
```

## Exemplo de criação de consulta

```json
{
  "doctorName": "Dra. Maria Souza",
  "specialty": "Clínico Geral",
  "date": "2026-03-25",
  "time": "14:00",
  "notes": "Consulta de rotina"
}
```

## Observações

- O endpoint de clima depende da variável `OPENWEATHER_API_KEY`.
- Se a chave não for informada, o sistema continua funcionando, apenas sem previsão climática real.
- O endpoint de CEP exige autenticação.
