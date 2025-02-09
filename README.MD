# Restaurant API

## Portuguese Version

### Descrição
Este projeto tem como objetivo o estudo e aprimoramento de desenvolvimento backend, com foco na otimização do atendimento em restaurantes. A aplicação é construída utilizando **TypeScript** para segurança e escalabilidade, **Zod** para validação de dados, **SQLite** como banco de dados leve e eficiente, **Fastify** para um servidor rápido e performático, e **Swagger** para documentação clara e acessível da API.

O sistema visa facilitar a gestão de pedidos, otimizar o fluxo de atendimento e garantir uma comunicação eficiente entre cozinha e equipe de serviço.

### Instalação
1. Clone o repositório:
    ```sh
    git clone <URL_DO_REPOSITORIO>
    ```
2. Instale as dependências:
    ```sh
    npm install
    ```

### Uso
1. Inicie o servidor:
    ```sh
    npm start
    ```
2. Acesse a documentação da API em:
    ```
    http://localhost:3333/docs
    ```

### Estrutura de Código
- [`src/server.ts`](): Configura e inicia o servidor Fastify.
- [`src/modules/dataManager/main.ts`](): Gerencia a conexão com o banco de dados SQLite e lê dados semi-estáticos de um arquivo JSON.
- [`src/model/baseController.ts`](): Classe base para os controladores, inicializa a conexão com o banco de dados.
- [`src/model/table/TableController.ts`](): Controlador para gerenciar mesas do restaurante.


## English Version

### Description
This project aims to study and enhance backend development, focusing on optimizing restaurant service. The application is built using **TypeScript** for security and scalability, **Zod** for data validation, **SQLite** as a lightweight and efficient database, **Fastify** for a high-performance server, and **Swagger** for clear and accessible API documentation.

The system is designed to streamline order management, optimize service flow, and ensure efficient communication between the kitchen and the service team.


### Installation
1. Clone the repository:
    ```sh
    git clone <REPOSITORY_URL>
    ```
2. Install the dependencies:
    ```sh
    npm install
    ```

### Usage
1. Start the server:
    ```sh
    npm start
    ```
2. Access the API documentation at:
    ```
    http://localhost:3333/docs
    ```

### Code Structure
- [`src/server.ts`](): Configures and starts the Fastify server.
- [`src/modules/dataManager/main.ts`](): Manages the SQLite database connection and reads semi-static data from a JSON file.
- [`src/model/baseController.ts`](): Base class for controllers, initializes the database connection.
- [`src/model/table/TableController.ts`](): Controller to manage restaurant tables.