import type { ClientMarker, LatLng } from "../types";

interface ClientsStoreState {
  clients: Map<string, ClientMarker>;
}

export class ClientsStore {
  private state: ClientsStoreState = {
    clients: new Map<string, ClientMarker>(),
  };

  getAll(): ClientMarker[] {
    let out: ClientMarker[] = [];

    for (const [key, value] of this.state.clients) {
      out.push(value);
    }

    return out;
    //also you can do return Array.from(this.state.clients.values())
  }

  getById(clientId: string): ClientMarker | undefined {
    const out = this.state.clients.get(clientId);

    return out;
    //also can do return this.state.clients.get(clientId);
  }

  has(clientId: string): boolean {
    return this.state.clients.has(clientId);
  }

  add(client: ClientMarker): void {
    this.state.clients.set(client.clientId, client);
  }

  updateCoords(clientId: string, coords: LatLng): ClientMarker | undefined {
    const out = this.state.clients.get(clientId);

    if (!out) return undefined;

    out.coords = coords;
    out.updatedAt = Date.now();

    return out;
  }

  remove(clientId: string): boolean {
    return this.state.clients.delete(clientId);
  }
}
