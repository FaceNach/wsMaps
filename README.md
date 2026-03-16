# Socket Maps

A real-time collaborative map application built with a **WebSocket backend (Bun + TypeScript)** and a **React frontend (Vite + TypeScript + Mapbox GL)**.

This repository contains two projects:

- `socketMapsBackend` → WebSocket server that manages connected clients and broadcasts live position updates.
- `socketMapsFrontend` → Web UI that connects to the socket server and renders users as markers on a Mapbox map.

---

## English

## Project Overview

Socket Maps lets multiple users connect to the same map session and see each other in real time.

Main flow:

1. A user enters a name and color in the frontend.
2. The frontend stores that info in cookies and opens a WebSocket connection.
3. The backend reads user info from cookies during the socket upgrade.
4. On connect, the backend:
   - registers the client,
   - sends a `WELCOME` message to that client,
   - sends current `CLIENT_STATE`,
   - broadcasts `CLIENT_JOIN` to others.
5. While dragging a marker, the frontend sends `CLIENT_MOVE` messages.
6. The backend broadcasts movement and disconnection events (`CLIENT_MOVE`, `CLIENT_LEFT`).

---

## Repository Structure

- `socketMapsBackend/`
  - Bun WebSocket server
  - Validation with Zod
  - In-memory client store (Map)
- `socketMapsFrontend/`
  - React 19 + Vite 7 + TypeScript
  - Map rendering with `mapbox-gl`
  - WebSocket context/provider for realtime communication

---

## Tech Stack

### Backend (`socketMapsBackend`)

- **Runtime:** Bun
- **Language:** TypeScript
- **Transport:** Native WebSocket support via `Bun.serve`
- **Validation:** Zod
- **Architecture:** handlers + services + store

### Frontend (`socketMapsFrontend`)

- **Framework:** React 19
- **Bundler/Dev Server:** Vite 7
- **Language:** TypeScript
- **Maps:** Mapbox GL JS
- **State/Realtime:** React Context + WebSocket API
- **Cookies:** js-cookie

---

## Prerequisites

- **Bun** installed (used by both projects in this repo)
- **Node.js** (optional but useful for tooling compatibility)
- A **Mapbox token** for the frontend (`VITE_MAPS_KEY`)

---

## Environment Variables

### Backend (`socketMapsBackend/.env`)

The backend README indicates an `.env` should be created from `.env.template`.  
Based on the code, these are used:

- `PORT` (default: `3000` if missing)
- `DEFAULT_CHANNEL` (default: `default-channel` if missing)

> Note: the frontend currently connects to `ws://localhost:3200`, so set backend `PORT=3200` (or update frontend URL).

### Frontend (`socketMapsFrontend/.env`)

- `VITE_MAPS_KEY=your_mapbox_public_token`

---

## How to Run (Development)

Open **two terminals** from the repository root.

### 1) Start backend

```socketMaps/README.md#L1-4
cd socketMapsBackend
bun install
bun run dev
```

Recommended `.env` example:

```socketMaps/README.md#L1-3
PORT=3200
DEFAULT_CHANNEL=default-channel
```

### 2) Start frontend

```socketMaps/README.md#L1-4
cd socketMapsFrontend
bun install
bun run dev
```

Then open the local URL printed by Vite (usually `http://localhost:5173`).

---

## Useful Scripts

### Backend

- `bun run dev` → run server with hot reload
- `bun run start` → run server normally

### Frontend

- `bun run dev` → start Vite dev server
- `bun run build` → type-check + production build
- `bun run preview` → preview production build
- `bun run lint` → run ESLint

---

## WebSocket Message Types (High-level)

### Client → Server

- `GET_CLIENTS`
- `CLIENT_REGISTER`
- `CLIENT_MOVE`
- `CLIENT_LEFT`

### Server → Client

- `WELCOME`
- `CLIENT_STATE`
- `CLIENT_JOIN`
- `CLIENT_MOVE`
- `CLIENT_LEFT`
- `ERROR`

---

## Notes

- Client state is currently stored **in memory** on the backend (no database).
- Authentication is not implemented.
- Cookies (`name`, `color`, `coords`) are required by the backend during WebSocket upgrade.
- There is a small port mismatch by default (`backend` defaults to 3000, `frontend` points to 3200), so align them before running.

---

## Español

## Resumen del Proyecto

Socket Maps permite que varios usuarios se conecten a un mismo mapa y vean posiciones en tiempo real.

Flujo principal:

1. El usuario completa nombre y color en el frontend.
2. El frontend guarda esos datos en cookies y abre una conexión WebSocket.
3. El backend lee las cookies durante el upgrade del socket.
4. Al conectar, el backend:
   - registra al cliente,
   - envía `WELCOME` al cliente nuevo,
   - envía `CLIENT_STATE` con el estado actual,
   - publica `CLIENT_JOIN` al resto.
5. Mientras se arrastra el marcador, el frontend envía `CLIENT_MOVE`.
6. El backend publica movimientos y salidas (`CLIENT_MOVE`, `CLIENT_LEFT`).

---

## Estructura del Repositorio

- `socketMapsBackend/`
  - Servidor WebSocket con Bun
  - Validación con Zod
  - Store en memoria con `Map`
- `socketMapsFrontend/`
  - React 19 + Vite 7 + TypeScript
  - Mapa con `mapbox-gl`
  - Contexto WebSocket para comunicación en tiempo real

---

## Tecnologías

### Backend (`socketMapsBackend`)

- **Runtime:** Bun
- **Lenguaje:** TypeScript
- **WebSocket:** `Bun.serve`
- **Validación:** Zod
- **Patrón:** handlers + services + store

### Frontend (`socketMapsFrontend`)

- **Framework:** React 19
- **Build/Dev server:** Vite 7
- **Lenguaje:** TypeScript
- **Mapas:** Mapbox GL JS
- **Tiempo real:** React Context + WebSocket nativo
- **Cookies:** js-cookie

---

## Requisitos Previos

- **Bun** instalado
- **Node.js** (opcional, recomendado para tooling)
- Token de **Mapbox** para el frontend (`VITE_MAPS_KEY`)

---

## Variables de Entorno

### Backend (`socketMapsBackend/.env`)

Según el proyecto, se crea desde `.env.template`.  
Variables usadas por el código:

- `PORT` (por defecto: `3000`)
- `DEFAULT_CHANNEL` (por defecto: `default-channel`)

> Importante: el frontend apunta a `ws://localhost:3200`, por lo que conviene usar `PORT=3200` o cambiar esa URL en frontend.

### Frontend (`socketMapsFrontend/.env`)

- `VITE_MAPS_KEY=tu_token_publico_de_mapbox`

---

## Cómo levantar el proyecto (desarrollo)

Abrí **dos terminales** en la raíz del repo.

### 1) Levantar backend

```socketMaps/README.md#L1-4
cd socketMapsBackend
bun install
bun run dev
```

Ejemplo recomendado de `.env`:

```socketMaps/README.md#L1-3
PORT=3200
DEFAULT_CHANNEL=default-channel
```

### 2) Levantar frontend

```socketMaps/README.md#L1-4
cd socketMapsFrontend
bun install
bun run dev
```

Después abrí la URL local que imprime Vite (normalmente `http://localhost:5173`).

---

## Scripts útiles

### Backend

- `bun run dev` → servidor con hot reload
- `bun run start` → ejecución normal

### Frontend

- `bun run dev` → servidor de desarrollo
- `bun run build` → type-check + build de producción
- `bun run preview` → previsualizar build
- `bun run lint` → ejecutar ESLint

---

## Tipos de Mensajes WebSocket (alto nivel)

### Cliente → Servidor

- `GET_CLIENTS`
- `CLIENT_REGISTER`
- `CLIENT_MOVE`
- `CLIENT_LEFT`

### Servidor → Cliente

- `WELCOME`
- `CLIENT_STATE`
- `CLIENT_JOIN`
- `CLIENT_MOVE`
- `CLIENT_LEFT`
- `ERROR`

---

## Notas

- El estado de clientes está en **memoria** (sin base de datos).
- No hay autenticación implementada.
- Las cookies (`name`, `color`, `coords`) son necesarias para conectar.
- Hay un desajuste de puerto por defecto (backend 3000 vs frontend 3200): alinearlo antes de correr.