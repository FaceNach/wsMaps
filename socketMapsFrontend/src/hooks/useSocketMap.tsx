import { use, useCallback, useEffect, useRef, useState } from "react";

import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import Cookies from "js-cookie";
import {
  WebSocketContext,
  type SocketResponse,
} from "../context/WebSocketContext";
import type { Client } from "../types";

mapboxgl.accessToken = import.meta.env.VITE_MAPS_KEY;

const clientsMarkers = new Map<string, mapboxgl.Marker>();

export const useSocketMap = (onClientMove?: (client: Client) => void) => {
  const { status, connectToServer, subscribeToMessages, send } =
    use(WebSocketContext);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map>(null);

  const [me, setMe] = useState<Client | null>(null);

  useEffect(() => {
    const name = Cookies.get("name");
    const color = Cookies.get("color");
    const coordsString = Cookies.get("coords");

    if (!name || !color || !coordsString) return;
    if (status !== "offline") return;

    const coords = JSON.parse(coordsString);
    connectToServer(name, color, coords);
  }, [connectToServer, status]);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current, // container ID
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      center: [-122.467895, 37.800126], // starting position [lng, lat]
      zoom: 14.5, // starting zoom
      attributionControl: false,
    });
  }, []);

  const createMarker = useCallback(
    (client: Client, draggable: boolean = false) => {
      if (!map.current) return;
      if (clientsMarkers.has(client.clientId)) return;

      const marker = new mapboxgl.Marker({
        color: client.color || "gray",
      })
        .setLngLat([client.coords.lng, client.coords.lat])
        .setDraggable(draggable)
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${client.name} </h3>`))
        .addTo(map.current)
        .on("drag", (event) => {
          const lngLat = event.target.getLngLat();
          setMe((prev) => {
            if (!prev || prev.clientId !== client.clientId) return prev;
            return {
              ...prev,
              coords: { lng: lngLat.lng, lat: lngLat.lat },
            };
          });
          send({
            type: "CLIENT_MOVE",
            payload: {
              clientId: client.clientId,
              coords: event.target.getLngLat(),
            },
          });
        });

      clientsMarkers.set(client.clientId, marker);
      return marker;
    },
    [send],
  );

  const moveMarker = (payload: Client) => {
    if (!clientsMarkers.has(payload.clientId)) return;

    const marker = clientsMarkers.get(payload.clientId);
    marker?.setLngLat([payload.coords.lng, payload.coords.lat]);
    return;
  };

  const removeMarker = (clientId: string) => {
    if (!clientsMarkers.has(clientId)) return;
    const marker = clientsMarkers.get(clientId);
    if (!marker) return;

    marker.remove();
  };

  const handleResponse = useCallback(
    (response: SocketResponse) => {
      const { type, payload } = response;

      switch (type) {
        case "WELCOME":
          setMe(payload);
          createMarker(payload, true);
          break;
        case "CLIENT_JOIN":
          createMarker(payload);
          break;
        case "CLIENT_MOVE":
          setMe((prev) => {
            if (!prev || payload.clientId !== prev.clientId) return prev;

            const next = {
              ...prev,
              coords: payload.coords,
              updatedAt: payload.updatedAt,
            };

            onClientMove?.(next);
            return next;
          });

          moveMarker(payload);
          break;
        case "CLIENT_LEFT":
          removeMarker(payload.clientId);
          break;
        case "CLIENT_STATE":
          payload.forEach((client) => createMarker(client, false));
          break;
      }
    },
    [createMarker, onClientMove],
  );

  useEffect(() => {
    return subscribeToMessages(handleResponse);
  }, [subscribeToMessages, handleResponse]);

  return {
    mapContainer,
    map,
    me,
    connectToServer,
    status,
  };
};
