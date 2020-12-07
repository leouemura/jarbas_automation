## run project:
nodemon src/index.js

## knex commands:
npx knex migrate:up
npx knex migrate:latest
npx knex migrate:rollback
npx knex migrate:rollback --all
npx knex seed:run