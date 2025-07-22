# Porta Simulator Server

Servidor de teste para o aplicativo mobile `Controle de Portas`.

## Como usar

1. Instale dependências:

```bash
cd server
npm install
```

2. Inicie o servidor:

```bash
npm start
```

Por padrão roda em `http://localhost:4000`.

## Endpoints

| Método | Rota                       | Descrição                            |
|--------|----------------------------|--------------------------------------|
| GET    | /api/doors                 | Lista o estado das 5 portas          |
| POST   | /api/doors/:id/open        | Abre a porta com `id`                |
| POST   | /api/doors/:id/close       | Fecha a porta com `id`               |
| GET    | /api/logs                  | Retorna logs de ações executadas     |

### Exemplo

```bash
curl http://localhost:4000/api/doors
curl -X POST http://localhost:4000/api/doors/1/open
curl http://localhost:4000/api/logs
```

Logs são mantidos em memória (máx. 1000 registros) e zerados ao reiniciar. 