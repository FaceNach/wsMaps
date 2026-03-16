import { safeParseAsync } from "zod/mini";
import {
  messageSchema,
  type ClientMovePayload,
  type ClientRegisterPayload,
} from "../schemas/websocket-message.schema";
import type { OutgoingWsMessage } from "../types";
import { clientService } from "../services/clients.service";

interface HandlerResult {
  personal: OutgoingWsMessage[];
  broadcast: OutgoingWsMessage[];
}

const createErrorResponse = (error: string): OutgoingWsMessage => {
  return {
    type: "ERROR",
    payload: { error: error },
  };
};

export const handleGetClients = (): HandlerResult => {
  return {
    personal: [
      {
        type: "CLIENT_STATE",
        payload: clientService.getAllClients(),
      },
    ],
    broadcast: [],
  };
};

export const handleClientRegister = (
  clientId: string,
  payload: ClientRegisterPayload,
): HandlerResult => {
  const newClient = clientService.registerClient(payload);

  if ("error" in newClient) {
    return {
      personal: [createErrorResponse(newClient.error)],
      broadcast: [],
    };
  }

  return {
    personal: [
      {
        type: "WELCOME",
        payload: newClient,
      },
      {
        type: "CLIENT_STATE",
        payload: clientService
          .getAllClients()
          .filter((client) => client.clientId !== clientId),
      },
    ],
    broadcast: [
      {
        type: "CLIENT_JOIN",
        payload: newClient,
      },
    ],
  };
};

export const handleClientMove = (
  clientId: string,
  payload: ClientMovePayload,
): HandlerResult => {
  const clientMove = clientService.clientMove(clientId, payload);

  if ("error" in clientMove) {
    return {
      personal: [createErrorResponse(clientMove.error)],
      broadcast: [],
    };
  }

  return {
    personal: [],
    broadcast: [
      {
        type: "CLIENT_MOVE",
        payload: {
          clientId: clientMove.clientId,
          coords: clientMove.coords,
          updatedAt: clientMove.updatedAt,
        },
      },
    ],
  };
};

export const handleClientLeft = (clientId: string): HandlerResult => {
  const clientLeft = clientService.removeClient(clientId);

  if (!clientLeft) {
    return {
      personal: [createErrorResponse("Error trying to remove client")],
      broadcast: [],
    };
  }

  return {
    personal: [],
    broadcast: [
      {
        type: "CLIENT_LEFT",
        payload: { clientId },
      },
    ],
  };
};

//! General Handler o controlador general
export const handleMessage = (
  clientId: string,
  rawMessage: string,
): HandlerResult => {
  try {
    const jsonData: unknown = JSON.parse(rawMessage);
    const parsedResult = messageSchema.safeParse(jsonData);

    if (!parsedResult.success) {
      console.log(parsedResult.error);
      const errorMessage = parsedResult.error.issues
        .map((issue) => issue.message)
        .join(", ");

      return {
        personal: [createErrorResponse(`Validation error: ${errorMessage}`)],
        broadcast: [],
      };
    }

    const { type, payload } = parsedResult.data;

    switch (type) {
      case "GET_CLIENTS":
        return handleGetClients();

      case "CLIENT_REGISTER":
        return handleClientRegister(clientId, payload);

      case "CLIENT_MOVE":
        return handleClientMove(clientId, payload);

      case "CLIENT_LEFT":
        return handleClientLeft(clientId);

      default:
        return {
          personal: [createErrorResponse(`Unknown message type ${type}`)],
          broadcast: [],
        };
    }
  } catch (error) {
    console.log({ error });
    return {
      personal: [createErrorResponse(`Unknown error found: ${error}`)],
      broadcast: [],
    };
  }
};
