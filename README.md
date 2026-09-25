SETUP:

duplique o env.example e adicione as variáveis de ambiente corretas

PRIMEIRA VEZ:
docker compose up --build

SEGUNDA VEZ:
docker compose up

CRIAR DEPARTAMENTOS:

`POST /departments` recebe somente o título:

```json
{ "title": "Engenharia Civil" }
```

Retorna `201` com o departamento criado ou `400` com `message` em caso de erro.
O código é gerado no back-end por `src/utils/generateEntityCode.js`, no formato
`PREFIXO + ANO + SEMESTRE + '-' + DÍGITO` (ex.: `ECI2602-0`). A data usa UTC,
como o banco: janeiro a maio é `01`; junho a dezembro é `02`.
O dígito começa em `0` e aumenta em colisões, incluindo códigos de registros
excluídos. Se `0` a `9` estiverem ocupados, o cadastro retorna erro, mantendo
o formato de 9 caracteres. A restrição única no banco protege cadastros simultâneos.

O gerador não depende de departamentos. A escolha do próximo dígito disponível
fica no serviço da entidade. Esta implementação inclui apenas criação;
autenticação e preenchimento de `created_by` continuam pendentes.

Testes:

```bash
docker compose exec api node --test tests/generateEntityCode.test.js tests/departmentsService.test.js
```

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
