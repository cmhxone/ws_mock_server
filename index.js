import ip from "ip";
import { WebSocketServer } from "ws";

import { logger } from "./utils/logger.js";

const port = 8000;

const wsServer = new WebSocketServer(
  {
    port: port,
  },
  () => {
    logger.info(`Server runs on ws://${ip.address()}:${port}`);
  }
);

wsServer.on("connection", (ws) => {
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  }).on("message", (data) => {
    logger.info(data);
  });
});

const interval = setInterval(() => {
  wsServer.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping();
  });
}, 10_000);

wsServer.on("close", () => {
  clearInterval(interval);
});
