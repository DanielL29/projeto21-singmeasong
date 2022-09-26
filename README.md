
<div align="center">
    <img src="https://images.emojiterra.com/twitter/v14.0/128px/1f399.png" alt="JavaScriptLogo" width="100">
  </a>

  <h3 align="center">Sing me a Song(tests)</h3>
  <div align="center">
    21th Project of Driven Education
    <br />
  </div>
  <div align="center">
    An API to put your musics and score them!
    Testing it routes from back to front
    <br />
  </div>
</div>

<div align="center">
  <h3>Built With</h3>

  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" height="30px" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" height="30px" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30px" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" height="30px" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" height="30px" />
  <img src="https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white" height="30px" />

  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>

<!-- Table of Contents -->

<div align="center" style="margin-top: 50px">
    <h1> Project Guide</h1>
</div>

## Tests

-   Create recommendation (integrate/unit/e2e)
-   Upvote recommendation (integrate/unit/e2e)
-   Downvote recommendation (integrate/unit/e2e)
-   Get recommendations (integrate/unit/e2e)
-   Get recommendation (integrate/unit)
-   Get random recommendation (integrate/unit/e2e)
-   Get top recommendations (integrate/unit/e2e)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL = postgres://YOUR-USER-NAME:YOUR-PASSWORD@Hostname:5432/DatabaseName`

`NODE_ENV = 'test' or 'any' - 'test' to .env.test file, for .env file you can put anything`


# 

Create database

```bash
  npx prisma migrate dev
```

```bash
  npx prisma db seed
```


Start the server

```bash
  npm run dev
```

Tests Scripts

```bash
  npm run test:unit
```

```bash
  npm run test:integrate
```

```bash
  npm run test:e2e (to run frontend tests)
```

## Lessons Learned
- Unit tests
- E2E tests
# 

## Acknowledgements

-   [Badges for Github](https://dev.to/envoy_/150-badges-for-github-pnk)
-   [README inspiration](https://github.com/andrezopo/projeto18-valex#readme)

#

## Authors

-   Daniel Lucas Ederli

