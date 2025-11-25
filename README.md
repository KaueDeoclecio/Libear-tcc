Libear - Site de Ensino de Libras

📖 Sobre o Projeto

O Libear é uma plataforma web interativa desenvolvida como Trabalho de Conclusão de Curso (TCC), com o objetivo de democratizar o ensino da Língua Brasileira de Sinais (Libras) para ouvintes. Inspirado em plataformas de gamificação como o Duolingo, o projeto oferece uma jornada de aprendizado estruturada, envolvente e acessível.

A aplicação combina lições visuais, quizzes interativos, um sistema de tradução em tempo real (via vLibras) e elementos de gamificação (XP, níveis e ranking) para motivar o usuário durante o processo de aprendizado.

🚀 Funcionalidades Principais

Autenticação Segura: Sistema completo de cadastro e login de usuários com criptografia de senha e tokens JWT.

Trilha de Aprendizado: Lições organizadas por níveis de dificuldade (Iniciante, Intermediário e Difícil).

Quizzes Interativos: Exercícios de múltipla escolha com suporte a imagens e vídeos para fixação do conteúdo.

Gamificação:

Sistema de Pontos de Experiência (XP) ao completar lições.

Ranking (Leaderboard) global dos melhores alunos.

Feedback visual imediato de acertos e erros.

Perfil do Usuário: Área personalizada com dados do aluno e opção de logout.

Acessibilidade e Tradução: Integração nativa com a API vLibras em todas as páginas, permitindo a tradução de qualquer texto para Libras através de um avatar 3D.

Design Responsivo: Interface adaptável para desktops e dispositivos móveis.

🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando uma arquitetura moderna e desacoplada:

Front-end

HTML5 & CSS3: Estrutura semântica e estilização modular (arquitetura base/components/pages).

JavaScript (ES6+): Lógica de interface, manipulação do DOM e comunicação assíncrona com a API.

Font Awesome: Ícones vetoriais para a interface.

Back-end

Node.js: Ambiente de execução JavaScript no servidor.

Express.js: Framework web para construção da API RESTful.

JWT (JSON Web Tokens): Para autenticação segura e gerenciamento de sessões.

Bcrypt: Para hashing e segurança de senhas.

Mock Database: Simulação de banco de dados em memória para fins de demonstração e portabilidade.

Ferramentas

VS Code: Editor de código.

Live Server: Servidor local para desenvolvimento front-end.

Git: Controle de versão.

📂 Estrutura do Projeto

libras-duo/
├── backend/              # Servidor Node.js e API
│   ├── src/
│   │   ├── middleware/   # Middlewares (ex: autenticação)
│   │   ├── routes/       # Rotas da API (auth, lessons, etc.)
│   │   ├── mockDb.js     # Banco de dados simulado
│   │   └── index.js      # Ponto de entrada do servidor
│   ├── .env              # Variáveis de ambiente (não versionado)
│   └── package.json
│
└── frontend/             # Aplicação Web
    ├── assets/
    │   ├── css/          # Estilos modulares
    │   ├── js/           # Scripts da aplicação (api, login, etc.)
    │   ├── img/          # Imagens gerais
    │   └── logo/         # Logos do projeto
    ├── media/            # Arquivos de mídia das lições (vídeos/imagens)
    ├── index.html        # Página inicial (Mapa de Níveis)
    ├── lesson.html       # Página de Quiz
    └── ...               # Outras páginas HTML


🏁 Como Executar o Projeto

Siga estas instruções para rodar o projeto em sua máquina local.

Pré-requisitos

Node.js (versão LTS recomendada) instalado.

Git instalado.

Passo a Passo

Clone o repositório:

git clone (https://github.com/KaueDeoclecio/Libear-tcc.git)
cd Libear-tcc


Configure e Inicie o Back-end:

cd backend
npm install               # Instala as dependências

# Crie um arquivo .env na pasta backend com o seguinte conteúdo:
# JWT_SECRET="sua_chave_secreta_aqui"

npm run dev               # Inicia o servidor


O servidor iniciará em http://localhost:3001

Inicie o Front-end:

Abra uma nova aba no terminal.

Navegue até a pasta raiz do projeto (se necessário).

Se estiver usando o VS Code, instale a extensão Live Server, clique com o botão direito em frontend/login.html e selecione "Open with Live Server".

Alternativamente, você pode usar qualquer servidor estático de sua preferência.

Acesse a Aplicação:

Abra seu navegador e acesse o endereço fornecido pelo Live Server (geralmente http://127.0.0.1:5500/frontend/login.html).

📝 Licença

Este projeto foi desenvolvido para fins acadêmicos.

Desenvolvido por Kauê Deoclecio da Silva