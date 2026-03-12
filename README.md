# ⚽ Fut-Insight

O **Fut-Insight** é uma aplicação desenvolvida para **controle de elenco, registro de partidas, gerenciamento de campanhas de Weekend League e análise de desempenho no futebol virtual**.

O projeto evoluiu de uma aplicação local para uma estrutura mais completa, contando hoje com:

- **frontend em React + Vite**
- **aplicação desktop com Electron**
- **backend próprio em Node.js**
- **banco SQLite local**
- **autenticação com login, registro e sessão por cookie**

Além da utilidade prática, o Fut-Insight também representa minha evolução em desenvolvimento de software, arquitetura de aplicações e organização de código.

---

## 🚀 Stack principal

- **React**
- **Vite**
- **JavaScript**
- **Material UI**
- **Electron**
- **Node.js**
- **SQLite** (`node:sqlite`)
- **Node test runner**

---

## 🏗 Arquitetura do projeto

O projeto foi reorganizado para uma estrutura mais profissional, separando frontend, backend, camada desktop e testes.

### Estrutura na raiz

- `src/` → frontend da aplicação
- `server/` → backend HTTP e persistência local
- `electron/` → bootstrap da versão desktop
- `tests/` → testes automatizados
- `scripts/` → utilitários auxiliares para geração e manipulação de dados

---

## 🎨 Frontend

O frontend foi reorganizado em uma estrutura modular, com separação por domínio de negócio e recursos compartilhados.

### `src/app/`
Responsável pelo núcleo da aplicação, incluindo:

- bootstrap
- layout global
- tema
- roteamento principal

### `src/features/`
Módulos organizados por domínio do produto.

Atualmente o projeto possui:

- `auth`
- `campaigns`
- `dashboard`
- `history`
- `matches`
- `players`
- `squad`

### `src/shared/`
Recursos compartilhados entre diferentes partes do sistema.

Exemplos:

- `api/`
- `assets/`
- `components/`
- `data/`
- `lib/`

Essa organização facilita manutenção, reaproveitamento e crescimento do projeto.

---

## 🧠 Backend

O backend atual está centralizado em `server/app.mjs` e segue uma proposta simples, direta e funcional.

### Características principais

- servidor HTTP próprio com `node:http`
- persistência local com SQLite usando `node:sqlite`
- API REST para os dados do app
- autenticação com:
  - registro
  - login
  - logout
  - sessão com cookie `HttpOnly`

O backend funciona como a camada central da aplicação, atendendo tanto a versão web quanto a versão desktop.

---

## 🗄 Banco de dados

O banco de dados local fica em:

- `server/data/fut-insight.sqlite`

Atualmente, o projeto persiste:

- usuários
- sessões
- jogadores
- partidas
- campanhas
- times salvos

Todos os dados da aplicação são **isolados por usuário autenticado**, garantindo separação entre contas e maior consistência no fluxo da aplicação.

---

## ✅ Funcionalidades atuais

O Fut-Insight já conta com funcionalidades importantes para uso prático e evolução futura:

- cadastro e edição de jogadores
- registro e histórico de partidas
- criação e gerenciamento de campanhas
- dashboard com estatísticas
- montagem de elenco
- autenticação com registro e login
- proteção de rotas no frontend e no backend
- exportação e importação de dados

---

## 🔐 Autenticação

O projeto agora possui um fluxo completo de autenticação.

### Registro

- nome
- email
- senha
- confirmação de senha
- validação de email
- validação de senha mínima
- bloqueio de email duplicado

### Login

- validação de credenciais
- criação de sessão
- persistência do usuário autenticado no frontend

### Sessão

- rotas privadas protegidas
- bloqueio de acesso às telas de login e registro para usuários autenticados
- logout funcional

---

## 📜 Scripts disponíveis

### Desenvolvimento geral

```bash
npm run dev
```

### Frontend apenas

```bash
npm run dev:web
```

### Backend apenas

```bash
npm run server
```

### Testes

```bash
npm test
```

### Build web

```bash
npm run build
```

### Electron em desenvolvimento

```bash
npm run electron:dev
```

### Electron desktop

```bash
npm run electron:start
```

---

## 🛠 Como rodar o projeto

### Pré-requisitos

Antes de começar, você precisa ter instalado:

- Node.js 24 ou superior
- npm
- Git

### Instalação

```bash
git clone https://github.com/LHRibeiro10/Fut-Insight-.git
cd Fut-Insight-
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

**Frontend**
- `http://localhost:5173`

**Backend**
- `http://127.0.0.1:3001`

### Build de produção

```bash
npm run build
```

---

## 🧪 Testes

Os testes ficam em `tests/` e atualmente cobrem utilitários importantes, como:

- formatação
- busca
- estatísticas

Para executar os testes:

```bash
npm test
```

---

## 📌 Observações

- o projeto usa alias `@` apontando para `src/`
- a base local SQLite não deve ser versionada
- o backend serve como API única para as versões web e desktop

---

## 🔮 Próximos passos sugeridos

Algumas evoluções interessantes para o projeto:

- reset de senha
- verificação de email
- melhoria no gerenciamento de sessão
- testes automatizados para autenticação
- code splitting adicional para a base grande de jogadores

---

<<<<<<< HEAD
=======
### `src/assets/`
Arquivos estáticos como:
- logo
- imagens
- ícones
- recursos visuais

---

### `src/App.jsx`
Componente principal da aplicação.

É o ponto central de montagem da interface e distribuição das páginas/componentes.

### `src/main.jsx`
Ponto de entrada da aplicação React.

Responsável por renderizar o `App` na tela.

### `src/index.css` / `src/styles.css`
Arquivos de estilo globais da aplicação.

---

## ⚙️ O que o sistema faz hoje

O Fut-Insight foi criado para ajudar no acompanhamento e análise de desempenho.

Entre as funcionalidades do projeto, estão:

- cadastro e gerenciamento de jogadores
- registro de partidas
- visualização de histórico
- acompanhamento de campanhas
- estatísticas de desempenho
- dashboard resumido
- preenchimento automático de informações
- organização visual do elenco

---

## 📌 Objetivo do Projeto

O Fut-Insight foi criado para ser uma ferramenta prática de acompanhamento de desempenho, organização de elenco e análise de campanhas, com foco em usabilidade, visão estatística e evolução contínua.

Além de ser útil na prática, o projeto também funciona como parte do portfólio de desenvolvimento, demonstrando organização de código, estrutura de interface e construção de funcionalidades reais.

---

## 🔮 Melhorias Futuras

Algumas ideias para evolução do projeto:

filtros avançados de jogadores

gráficos mais completos

exportação de dados

melhorias de responsividade

sincronização em nuvem

importação e exportação de elenco

refinamento do preenchimento automático

---


>>>>>>> d8976e093cc56569ad83328a5a66cf5c84e2d5de
## 👨‍💻 Autor

Luiz Henrique Ribeiro

Projeto desenvolvido para estudo, prática e evolução em desenvolvimento de software.
