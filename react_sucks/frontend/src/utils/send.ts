import MessageClass, { Message, connectToChat } from "./websocket";

export async function send(item: Message) {
    const socket = await connectToChat();
    const msg = new MessageClass(socket);
    msg.send(socket, item)
};
