## How to run

- Install dependencies: `npm install`
- Start Postgres database server. If you have Docker, you can run this command instead:

  ```sh
  docker run -it --rm -p 5432:5432 -e POSTGRES_DB=[dbname] -e POSTGRES_USER=[username] -e POSTGRES_PASSWORD=[password] postgres -c log_statement=all
  ```

  Replace the values between square brackets to your own.

- Write `.env` file at the project root.
  ```
  DATABASE_URL="postgresql://[username]:[password]@localhost:5432/[dbname]"
  ```
  Replace the values between square brackets to match the first step.
- Run `npx prisma migrate reset` to initialize tables in the postgres database.
- Run `npm run dev`
