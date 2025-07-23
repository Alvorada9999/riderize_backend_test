#### Crie um ".env" com as seguites variáveis
- JWT_SECRET
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- CACHE_TIME
    - Por quanto tempo o cache será guardado em milissegundos
    ###### ⚠️  Não irão aparecer atualizações pro usário até que este tempo acabe, recomendo 60000 (1 minuto)

##### Para subir a aplicação
```bash
docker-compose up --build -d
```
###### ⚠️  Certifique-se de que nenhuma aplicação esteja usando a porta 8000 da sua máquina
##### Para parar e manter o volume do banco
```bash
docker-compose down
```
##### Para parar e não manter o volume do banco
```bash
docker-compose down -v
```
##### Para consumir os endpoints na sua máquina
Use "localhost:8000" para acessar o Apollo sandbox e ter uma interface para interagir com a api<br>
Use "localhost:8000/graphql" para consumir o endpoint GraphQL diretamente

### O que foi feito
- Requesitos cumpridos
    - Deverá ser utilizado o NodeJS;
    - Utilizar o TypeScript;
    - A API deverá ser construída usando o GraphQL;
    - Os dados deverão persistir em algum DB, aqui no Riderize usamos o PostgreSQL para isso;
    - Todas as consultas deverão ser feitas usando o seguinte header de autenticação, para isso será necessário usar o JWT: Authentication: Bearer <THE.JWT.TOKEN>;
- Criação e login de usuários
- Cache LFU com TTL no Redis
- Conteinerização com Docker
- Validação dos inputs do usuário (Datas, email e tamho da senha)

### Ferramentas usadas
- Express
- Apollo Server
- TypeGraphQL
- TypeORM
    - A princípio usei o prisma mas troquei devido ao TypeGraphQL
        - O TypeGraphQL visa resolver o problema de ter mais de uma fonte de confiança, quando usando GraphQL é comum que se tenha entities e types GraphQL separados, com o TypeGraphQL, isso é resolvido pelo uso de decorators nas classes das entities mas o Prisma não tem suas entities definadas em classes porém o TypeORM sim, com isso, a pasta "src/entities" possui as classes que são ambas as entities do TypeORM e types do GraphQL, tendo assim apenas uma fonte de confiaça
- Docker
- Redis
