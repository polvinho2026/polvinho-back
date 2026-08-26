SETUP:

duplique o env.example e adicione as variáveis de ambiente corretas

PRIMEIRA VEZ:
docker compose up --build

SEGUNDA VEZ:
docker compose up

SEEDS:

```bash
# Administrador + 30 usuários
docker compose exec api npm run db:seed

# Somente o administrador
docker compose exec api npm run db:seed:admin

# Somente os 30 usuários
docker compose exec api npm run db:seed:users
```

Administrador criado pelo seed:

- E-mail: `admin@polvinho.com`
- Matrícula/senha inicial: `1000000001`

Nos 30 usuários de teste, a senha inicial de cada usuário também é a própria matrícula (`2000000001` até `2000000030`).

RESETAR O BANCO:

> Atenção: os comandos abaixo apagam os dados existentes.

```bash
# Apaga os dados e recria somente a estrutura das tabelas
docker compose exec api npm run db:reset

# Apaga os dados, recria as tabelas e executa todos os seeds
docker compose exec api npm run db:reset:seed
```
