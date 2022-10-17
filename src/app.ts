import 'reflect-metadata';
import express, { Application } from "express";
import Logger from "./loaders/logger";
import loader from "./loaders";
import getAppConfig from './config/appConfig';

async function startServer() {
  const app: Application = express();
  await loader(app);
  const appConfig = getAppConfig()
  console.log("hello")
  app.listen(appConfig.port, () => {
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${appConfig.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });
}

startServer();