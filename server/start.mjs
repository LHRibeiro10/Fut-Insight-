import { getDatabasePath, startServer } from "./app.mjs";

const port = Number(process.env.PORT || 3001);

startServer({ port })
  .then(() => {
    console.log(`Fut Insight API em http://127.0.0.1:${port}`);
    console.log(`SQLite: ${getDatabasePath()}`);
  })
  .catch((error) => {
    console.error("Falha ao iniciar servidor:", error);
    process.exit(1);
  });
