# Frontend - Sistema de Atendimento Inteligente para Clínicas Médicas

Frontend completo em **Vue 3 + Vite**, conectado ao backend Node.js já criado para o projeto.

## Tecnologias

- Vue 3
- Vue Router
- Pinia
- Axios
- Vite
- Docker + Nginx
- Node.js 24
- npm 11

## Funcionalidades

- Login e cadastro integrados ao backend
- Persistência de autenticação com JWT
- Tela de dashboard do paciente
- Tela de agendamento de consultas
- Tela de perfil com consulta de CEP
- Painel administrativo com indicadores e mudança de status das consultas
- Consumo dos endpoints do backend já criado

## Configuração

Crie um arquivo `.env` com base no `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Rodando localmente

```bash
npm install
npm run dev
```

A aplicação sobe em:

```bash
http://localhost:5173
```

## Build de produção

```bash
npm run build
npm run preview
```

## Docker

```bash
docker build -t clinica-frontend .
```

Ou no `docker-compose.yml` do projeto principal:

```yaml
frontend:
  build:
    context: ./frontend
  container_name: clinica_frontend
  restart: unless-stopped
  ports:
    - "5173:80"
  depends_on:
    - backend
```

## Fluxo esperado

1. Cadastre um usuário.
2. Faça login.
3. Paciente pode agendar e acompanhar consultas.
4. Administrador acessa `/admin` e gerencia os atendimentos.

## Observação importante

- A tela de **perfil** consulta o endpoint protegido do backend para buscar CEP.
- A tela de **cadastro** usa a API pública do ViaCEP para melhorar a experiência antes do login.
- Mesmo sem clicar em buscar CEP, o backend também resolve o endereço automaticamente durante o registro quando o campo `cep` é enviado.
