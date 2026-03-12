import { use, useEffect, useRef } from "react";

import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import Cookies from "js-cookie";
import { WebSocketContext } from "../context/WebSocketContext";

mapboxgl.accessToken = import.meta.env.VITE_MAPS_KEY;

export const useSocketMap = () => {
  const { status, connectToServer } = use(WebSocketContext);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map>(null);

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

  return {
    mapContainer,
    map,
    connectToServer,
    status,
  };
};
