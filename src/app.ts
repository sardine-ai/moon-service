import 'reflect-metadata';
import express, { Application } from "express";
import Logger from "./loaders/logger";
import loader from "./loaders/index";
import getAppConfig from './config/app-config';
// import * as fs from 'fs';
// import https from 'https';

async function startServer() {
  const app: Application = express();
  await loader(app);
  const appConfig = getAppConfig()

  // https
  // .createServer(
  //   {
  //     key: fs.readFileSync("server.key"),
  //     cert: fs.readFileSync("server.cert"),
  //   },
  //   app
  // )
  // .listen(appConfig.port, () => {
  //   Logger.info(`
  //     ################################################
  //     🛡️  Server listening on https port: ${appConfig.port} 🛡️
  //     ################################################
  //   `);
  // });

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