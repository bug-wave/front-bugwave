# [Front - BugWave]

Uma plataforma inovadora para submissão e avaliação de artigos acadêmicos em eventos. Desenvolvida com Next.js (frontend), esta aplicação permite que alunos submetam seus trabalhos e recebam feedback detalhado de avaliadores.

## Sobre o Projeto

Este projeto é a interface de usuário (frontend) de uma plataforma web desenvolvida para facilitar o processo de submissão de artigos por alunos para eventos acadêmicos, científicos ou conferências. A plataforma também integra um sistema de avaliação onde revisores podem analisar os artigos, deixar comentários e atribuir notas, fornecendo feedback valioso aos autores.

**Este frontend interage com um backend dedicado que pode ser encontrado em: [https://github.com/bug-wave/back-bugwave](https://github.com/bug-wave/back-bugwave)**

**Principais Funcionalidades (Frontend):**
*   **Interface de Submissão de Artigos por Alunos:** Formulários intuitivos para upload e gerenciamento de artigos.
*   **Visualização de Eventos:** Permite aos usuários verem os eventos disponíveis para submissão.
*   **Visualização de Feedback:** Alunos podem visualizar os comentários e avaliações recebidas em seus artigos.
*   **Interação com Sistema de Avaliação:** Permite que avaliadores acessem e interajam com os artigos para avaliação (a lógica de avaliação reside principalmente no backend).

## Tecnologias Utilizadas
*   **Framework:** [Next.js](https://nextjs.org)
*   **Linguagem:** TypeScript
*   **Fonte Padrão:** [Geist](https://vercel.com/font) (otimizada com `next/font`)
*   **Bibliotecas:** Material Ui, Tailwind CSS.

## Começando (Getting Started)

Siga estas instruções para obter uma cópia do projeto frontend em execução na sua máquina local para fins de desenvolvimento e teste.

### Pré-requisitos

*   Node.js (versão 18.x ou superior recomendada)
*   npm (geralmente vem com o Node.js) ou yarn/pnpm/bun
*   **O servidor backend deste projeto EM EXECUÇÃO.** Você precisará clonar, configurar e executar o backend separadamente.
    *   Repositório do Backend: [https://github.com/bug-wave/back-bugwave](https://github.com/bug-wave/back-bugwave)
    *   Siga as instruções no README do repositório backend para colocá-lo em funcionamento.

### Instalação do Frontend

1.  Clone o repositório do frontend:
    ```bash
    git clone https://github.com/bug-wave/front-bugwave
    ```
2.  Navegue até o diretório do projeto frontend:
    ```bash
    cd front-bugwave
    ```
3.  Instale as dependências do projeto frontend (MUITO IMPORTANTE):
    ```bash
    npm install
    # ou
    # yarn install
    # ou
    # pnpm install
    # ou
    # bun install
    ```

### Rodando o Servidor de Desenvolvimento do Frontend

**Importante:** Antes de iniciar o servidor de desenvolvimento do frontend, certifique-se de que o servidor backend ([https://github.com/bug-wave/back-bugwave](https://github.com/bug-wave/back-bugwave)) já esteja configurado e em execução conforme as instruções do seu respectivo README.

Após instalar as dependências do frontend e com o backend rodando, execute o servidor de desenvolvimento do frontend:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Acesse o link: http://localhost:3000
