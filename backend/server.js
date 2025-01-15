import dotenv from "dotenv/config";
import http, { createServer } from "http";
import app from "./app.js";

const port = process.env.PORT;

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
