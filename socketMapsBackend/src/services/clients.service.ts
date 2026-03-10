import type {
  ClientMovePayload,
  ClientRegisterPayload,
} from "../schemas/websocket-message.schema";
import { ClientsStore } from "../store/clients.store";
import type { ClientMarker, LatLng } from "../types";

class ClientsService {
  private readonly clientsStore: ClientsStore;

  constructor() {
    this.clientsStore = new ClientsStore();
  }

  getAllClients(): ClientMarker[] {
    return this.clientsStore.getAll();
  }

  registerClient(
    input: ClientRegisterPayload,
  ): ClientMarker | { error: string } {
    if (this.clientsStore.has(input.clientId)) {
      return {
        error: "Client already register",
      };
    }

    const clientM: ClientMarker = {
      clientId: input.clientId,
      name: input.name,
      color: input.color || "gray",
      coords: input.coords,
      updatedAt: Date.now(),
    };

    this.clientsStore.add(clientM);
    return clientM;
  }

  clientMove(
    clientId: string,
    input: ClientMovePayload,
  ): ClientMarker | { error: string } {
    const client = this.clientsStore.updateCoords(clientId, input.coords);

    if (!client) {
      return { error: "Client not registerd" };
    }

    return client;
  }

  removeClient(clientId: string): boolean {
    return this.clientsStore.remove(clientId);
  }
}

export const clientService = new ClientsService();
