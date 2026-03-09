## WebSocket Server - Political Parties

### Run in dev

1. Clone the project
2. Run `bun install`
3. Create `.env` based on `.env.template`
4. Run `bun run dev`

### Test in the browser

1. Open `http://localhost:3200` in the browser
2. In the console, create the message like this:

```javascript
const message = {
  type: 'SOME_MESSAGE_TYPE',
  payload: {
    id: 'an-item-identifier',
  },
};
```

3. Use the `socket` object to send the message

```javascript
socket.send(JSON.stringify(message));
```

4. Check the result in the browser console

## Documentation

Below are the **message types** (`MessageType`) that the WebSocket server accepts, along with the expected payload for each one:

Message example:

```javascript
const message = {
  type: 'SOME_MESSAGE_TYPE',
  payload: {
    id: 'an-item-identifier',
  },
};
```

---

## WebSocket Server - Partidos Políticos

### Ejecutar en dev

1. Clonar proyecto
2. Ejecutar `bun install`
3. Crear `.env` basado en `.env.template`
4. Ejecutar `bun run dev`

### Probar en el navegador

1. Abrir el archivo `http://localhost:3200` en el navegador
2. En la consola crear el mensaje así:

```javascript
const message = {
  type: 'ALGUN_TIPO_DE_MENSAJE',
  payload: {
    id: 'un-identificador-de-un-item',
  },
};
```

3. Usar el objeto `socket` para enviar el mensaje

```javascript
socket.send(JSON.stringify(message));
```

4. Ver el resultado en la consola del navegador

## Documentación

A continuación se enumeran los **tipos de mensajes** (`MessageType`) que el servidor WebSocket acepta, junto con el payload esperado para cada uno:

Ejemplo de mensaje:

```javascript
const message = {
  type: 'ALGUN_TIPO_DE_MENSAJE',
  payload: {
    id: 'un-identificador-de-un-item',
  },
};
```
