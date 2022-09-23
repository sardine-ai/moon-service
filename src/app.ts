import express, { Application } from "express";

require('dotenv').config();

const evmCommandsRouter = require('./src/routes/evmCommands.router');
const PORT = process.env.PORT || 8000;
const app: Application = express();

app.get("/", async (_req, res) => {});
app.use('/evm-commands', evmCommandsRouter);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});