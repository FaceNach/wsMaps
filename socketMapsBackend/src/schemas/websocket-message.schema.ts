import { z } from "zod";

const latLngSchema = z.object({
  lat: z.number("Latitude its required"),
  lng: z.number("Longitude its required"),
});

export const messageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("GET_CLIENTS"),
    payload: z.undefined().optional(),
  }),

  z.object({
    type: z.literal("CLIENT_REGISTER"),
    payload: z.object({
      clientId: z.string("Client ID its required").min(1),
      name: z.string("Name is required.").min(1),
      color: z.string("Color is required.").min(1).optional(),
      coords: latLngSchema,
    }),
  }),

  z.object({
    type: z.literal("CLIENT_MOVE"),
    payload: z.object({
      clientId: z.string("Client ID its required").min(1),
      coords: latLngSchema,
    }),
  }),

  z.object({
    type: z.literal("CLIENT_LEFT"),
    payload: z.object({
      clientId: z.string("Client ID its required").min(1),
    }),
  }),
]);

export type MessageParsed = z.infer<typeof messageSchema>;
export type ClientRegisterPayload = Extract<
  MessageParsed,
  { type: "CLIENT_REGISTER" }
>["payload"];
export type ClientMovePayload = Extract<
  MessageParsed,
  { type: "CLIENT_MOVE" }
>["payload"];
export type GetClientsPayload = Extract<
  MessageParsed,
  { type: "GET_CLIENTS" }
>["payload"];
