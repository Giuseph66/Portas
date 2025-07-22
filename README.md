# Portas – Sistema de Controle de Acesso IOT

> Controle inteligente de portas usando ESP32, WebSockets e aplicativo móvel React Native (Expo).

---

## Índice

1. Visão Geral
2. Arquitetura do Projeto
3. Pré-requisitos
4. Instalação e Execução
   1. Firmware/Arduino
   2. Backend de Simulação
   3. App Mobile (Expo)
5. Como Usar
6. Estrutura de Pastas
7. Scripts Úteis
8. Contribuição
9. Licença

---

## 1. Visão Geral

O **Portas** é um sistema completo de controle de acesso **(open-source)** que possibilita abrir e fechar portas remotamente, registrar logs e exibir tudo em um aplicativo móvel. O projeto é composto por três camadas principais:

* **Dispositivo** – Firmware para ESP32 que se conecta a um servidor via WebSockets, executa comandos e abre/fecha portas através de um motor (ponte‐H) e sinalização por LED.
* **Backend (Simulação)** – API REST simples em Node.js (Express) que mantém o estado das portas e histórico de logs para testes locais.
* **App Mobile** – Aplicativo em **React Native/Expo Router** que consume a API, lista portas, envia comandos de abrir/fechar e exibe o histórico de acessos.

> A comunicação em produção seria feita diretamente com um servidor WebSocket real (`esp-server.neurelix.com.br`). O backend local existe apenas para desenvolvimento.


## 2. Arquitetura do Projeto

```
┌──────────────────────────┐          HTTPS / REST          ┌───────────────────────┐
│  App Mobile (Expo)       │ ─────────────────────────────► │  Backend Node.js      │
│  • /mobile               │                               │  /mobile/server       │
└──────────────────────────┘                                └───────────────────────┘
          ▲                                                     ▲
          │  WebSocket SSL (443)                                │ REST opcional
          │                                                     │
┌─────────┴─────────┐                                  ┌────────┴──────────┐
│ ESP32 + Motor     │◄─────────── WebSocket ───────────│  Servidor WebSockets│
│ /arduino          │                                  │ (ex.: Cloudflare)  │
└────────────────────┘                                  └────────────────────┘
```

1. **ESP32** abre um *Access Point* se não tiver Wi-Fi salvo e exibe um portal de configuração.
2. Após conectar na rede, ele cria um ID aleatório, autentica no WebSocket e espera comandos (`abrir`, `fechar`, `piscar`, `limpar`).
3. O **App Mobile** faz *fetch* da lista de portas e envia comandos REST (`/api/cmd`) ou WebSocket (produção) para mudar o estado da porta.
4. O **Backend** registra logs (`/api/logs`) e devolve o histórico ao app.


## 3. Pré-requisitos

| Camada      | Requisitos |
|-------------|------------|
| **Arduino** | Placa ESP32, Arduino IDE &gt;= 2.0, bibliotecas: `WiFi`, `WebSocketsClient`, `WebServer`, `Preferences`, `DNSServer` |
| **Backend** | Node.js &gt;= 18, npm |
| **Mobile**  | Node.js &gt;= 18, **Expo CLI** (`npm install -g expo-cli`), dispositivo/emulador Android ou iOS |


## 4. Instalação e Execução

### 4.1 Firmware/Arduino

1. Abra `arduino/com_interface/com_interface.ino` no Arduino IDE.
2. Ajuste as credenciais padrão se desejar.
3. Compile e faça *upload* para seu ESP32.
4. A primeira inicialização cria um AP chamado **`Porta automatica`**. Conecte-se e acesse `http://192.168.10.1` para configurar SSID, senha e e-mail.

### 4.2 Backend de Simulação (opcional)

```bash
cd mobile/server
npm install
node index.js   # escuta em http://localhost:4000
```

### 4.3 App Mobile (Expo)

```bash
cd mobile
npm install      # ou pnpm / yarn
expo start       # abre o Expo DevTools
```

Escaneie o QR-Code com o aplicativo **Expo Go** ou inicie um emulador.

> Por padrão o app faz chamadas para `https://esp-server.neurelix.com.br`. Para usar o backend local altere os `fetch` endpoints ou crie uma variável de ambiente.


## 5. Como Usar

1. Abra o app e faça login (fluxo de autenticação simulado).
2. Na tela **Controle de Portas** toque em **Atualizar** para listar as portas disponíveis.
3. Clique em **Abrir** ou **Fechar**. O botão mostra *loading* até receber a resposta.
4. A guia **Histórico de Acessos** mostra quem abriu/fechou cada porta (dados vindos do backend).


## 6. Estrutura de Pastas

| Caminho              | Descrição |
|----------------------|-----------|
| `/arduino`           | Firmwares para ESP32  |
| `/mobile`            | App React Native/Expo |
| `/mobile/server`     | API REST de simulação |
| `/.vscode`           | Configurações do VS Code |


## 7. Scripts Úteis

| Comando                                        | Descrição |
|-----------------------------------------------|-----------|
| `npm run lint` (mobile)                       | Executa ESLint |
| `expo start -c` (mobile)                      | Limpa cache e inicia Expo |
| `node index.js` (mobile/server)               | Sobe API local |


## 8. Contribuição

1. Faça um *fork* do repositório.
2. Crie uma *branch* com sua feature: `git checkout -b feat/minha-feature`.
3. Commit e *push*: `git push origin feat/minha-feature`.
4. Abra um *Pull Request*.

Todos os tipos de contribuição (código, documentação, **issues**) são bem-vindos!


## 9. Licença

Este projeto é distribuído sob a licença **MIT**. Consulte o arquivo `LICENSE` para mais detalhes.
