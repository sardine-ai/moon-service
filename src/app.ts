import 'reflect-metadata';
import config from "./config";
import express, { Application } from "express";
import Logger from "./loaders/logger";
import loader from "./loaders";

async function startServer() {
  const app: Application = express();
  await loader(app);

  app.listen(config.port, () => {
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });
}

startServer();