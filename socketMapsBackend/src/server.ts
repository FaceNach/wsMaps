import { SERVER_CONFIG } from "./config/server-config";

import indexHtml from "../public/index.html";
import { generateUuid } from "./utils/generate-uuid";
import type { WebSocketData } from "./types";
import {
  handleClientLeft,
  handleClientRegister,
  handleMessage,
} from "./handlers/message.handler";
import { isForOfStatement } from "typescript";
import { json } from "zod/mini";

export const createServer = () => {
  const server = Bun.serve<WebSocketData>({
    port: SERVER_CONFIG.port,

    routes: {
      "/": indexHtml,
    },

    fetch(req, server) {
      const cookies = new Bun.CookieMap(req.headers.get("cookie")!);
      const name = cookies.get("name");
      const color = cookies.get("color") || "grey";
      const coords = cookies.get("coords")
        ? JSON.parse(cookies.get("coords")!)
        : null;
      const clientId = generateUuid();

      if (!name || !coords) {
        return new Response("Name and coords are required ", {
          status: 400,
        });
      }

      const upgraded = server.upgrade(req, {
        data: {
          clientId: clientId,
          name: name,
          color: color,
          coords: coords,
        },
      });

      if (upgraded) {
        return undefined;
      }

      return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
      open(ws) {
        ws.subscribe(SERVER_CONFIG.defaultChannelName);
        const welcomeMessage = handleClientRegister(ws.data.clientId, ws.data);

        for (const personalMessage of welcomeMessage.personal) {
          ws.send(JSON.stringify(personalMessage));
        }

        for (const broadcastMessage of welcomeMessage.broadcast) {
          ws.publish(
            SERVER_CONFIG.defaultChannelName,
            JSON.stringify(broadcastMessage),
          );
        }
      },
      message(ws, message: string) {
        //* Todos los mensajes que llegan al servidor de la misma forma
        // Se envía a un Handler General
        const response = handleMessage(ws.data.clientId, message);
        const responseString = JSON.stringify(response);

        for (const personalMessage of response.personal) {
          ws.send(JSON.stringify(personalMessage));
        }

        for (const broadcastMessage of response.broadcast) {
          ws.publish(
            SERVER_CONFIG.defaultChannelName,
            JSON.stringify(broadcastMessage),
          );
        }
      },
      close(ws, code, message) {
        //! Una vez que el cliente se desconecta, "de-suscribir" del canal por defecto
        // console.log(`Cliente desconectado: ${ws.data.clientId}`);
        ws.unsubscribe(SERVER_CONFIG.defaultChannelName);

        const clientLeftMessage = handleClientLeft(ws.data.clientId);
        for (const broadcastMessage of clientLeftMessage.broadcast) {
          ws.publish(
            SERVER_CONFIG.defaultChannelName,
            JSON.stringify(broadcastMessage),
          );
        }
      }, // a socket is closed
    }, // handlers
  });

  return server;
};
