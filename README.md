# ⚽ Fut-Insight

Bem-vindo ao **Fut-Insight**, uma aplicação desenvolvida para análise, organização e acompanhamento de desempenho no universo do futebol virtual, com foco em elenco, partidas, campanhas e estatísticas.

Este projeto foi pensado para funcionar como uma ferramenta prática de controle e análise, permitindo registrar jogos, gerenciar jogadores e acompanhar evolução de desempenho de forma visual e organizada.

A aplicação possui estrutura modular para facilitar manutenção, crescimento e criação de novas funcionalidades no futuro.

---

## 🚀 Tecnologias Principais

### Front-end
- **React**
- **Vite**
- **JavaScript**

### Desktop
- **Electron**

### Estilização
- **CSS**

### Testes
- **Testes automatizados com arquivos em `tests/`**

### Ferramentas auxiliares
- **Node.js**
- **npm**

---

## 📂 Entendendo a Estrutura de Pastas

Para trabalhar no projeto com mais segurança, é importante entender o papel de cada pasta.

A ideia é manter o código organizado, reaproveitável e fácil de evoluir.

---

## 🌲 Raiz do Projeto

### `electron/`
Contém a estrutura da versão desktop da aplicação usando Electron.

Aqui fica o ponto de entrada da aplicação desktop, responsável por abrir a interface React em uma janela nativa.

### `scripts/`
Scripts auxiliares usados para gerar, preparar ou manipular dados do projeto.

Exemplo:
- geração de base de dados
- importação de jogadores
- preparação de arquivos auxiliares

### `tests/`
Contém os testes automatizados do sistema.

Esses testes ajudam a validar regras importantes, utilitários e comportamentos da aplicação.

### `package.json`
Arquivo principal de configuração do projeto Node.js.

Define:
- dependências
- scripts
- nome do projeto
- versão
- comandos de execução e build

### `vite.config.js`
Arquivo de configuração do Vite.

Responsável por ajustar o comportamento do ambiente de desenvolvimento e build.

### `index.html`
Arquivo base carregado pelo Vite para renderização da aplicação React.

### `.gitignore`
Define os arquivos e pastas que não devem ser enviados ao GitHub, como:
- `node_modules/`
- `dist/`
- logs
- builds geradas automaticamente

---

## 📂 `src/` — Código Fonte Principal

Essa é a pasta mais importante do projeto.

Ela concentra a aplicação React e segue uma divisão por responsabilidade.

---

### `src/components/`
Contém os componentes reutilizáveis da interface.

Exemplos:
- cards
- painéis
- listas
- blocos visuais de estatísticas
- elementos de layout

Regra:
Componentes devem ser reaproveitáveis e focados em apresentação ou composição visual.

---

### `src/pages/`
Contém as páginas principais da aplicação.

Cada arquivo representa uma tela do sistema.

Exemplos do projeto:
- Dashboard
- Histórico
- Nova Partida
- Jogadores
- Elenco
- Estatísticas do Elenco
- Campanhas

Regra:
As páginas organizam os componentes e a lógica da tela, mas não devem concentrar utilidades genéricas desnecessárias.

---

### `src/data/`
Armazena bases de dados locais, seeds ou arquivos auxiliares usados pelo sistema.

Exemplos:
- listas base de jogadores
- dados iniciais
- arquivos para preenchimento automático

---

### `src/utils/`
Funções auxiliares reutilizáveis.

Exemplos:
- formatação
- cálculos estatísticos
- manipulação de dados
- buscas
- persistência local

Regra:
Tudo que pode ser reutilizado em mais de uma parte do sistema deve ser avaliado para esta pasta.

---

### `src/service/`
Camada de serviços específicos do projeto.

No caso do Fut-Insight, aqui ficam funcionalidades mais inteligentes ou automatizadas, como:
- preenchimento automático de dados
- buscas refinadas
- tratamento de informações específicas da aplicação

---

### `src/theme/`
Configurações visuais e de tema do projeto.

Serve para centralizar identidade visual e facilitar ajustes globais na interface.

---

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

comparação entre campanhas

exportação de dados

melhorias de responsividade

integração com banco de dados

autenticação de usuário

sincronização em nuvem

importação e exportação de elenco

refinamento do preenchimento automático

---


## 👨‍💻 Autor

Luiz Henrique Ribeiro

Projeto desenvolvido para estudo, prática e evolução em desenvolvimento de software.

## 🔗 Repositório

GitHub:
https://github.com/LHRibeiro10/Fut-Insight-.git


## 🛠 Guia de Instalação

Siga esta ordem para rodar o projeto localmente.

---

## 1. Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (recomendado: v18 ou superior)
- **npm**
- **Git**

---

## 2. Clone o repositório

```bash
git clone https://github.com/LHRibeiro10/Fut-Insight-.git
cd Fut-Insight-

---
## Como executar o projeto

1. Clone o repositório
git clone https://github.com/LHRibeiro10/Fut-Insight-.git
2. Acesse a pasta
cd Fut-Insight-
3. Instale as dependências
npm install
4. Rode o projeto
npm run dev
Build do projeto

Para gerar a versão de produção:

npm run build

