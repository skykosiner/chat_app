import { Message } from "./websocket";

export function send(ws: WebSocket, item: Message) {
    ws.send(JSON.stringify(item));
};
