import { EventEmitter } from "events";


import * as WebSocket from "ws";

export type Message = {
    source: "MESSAGE_USER"
    type:  "SEND_MESSAGE"
    data: {
        user_name: string,
        message: string,
        time_sent: string
    },
};

export async function connectToChat(): Promise<WebSocket> {
    return new WebSocket(
        `ws://localhost:42069/ws`
    );
};

export default class MessageClass extends EventEmitter {
    static create(): Promise<MessageClass> {
        return new Promise(async (res, rej) => {
            const socket = await connectToChat();

            function open() {
                res(new MessageClass(socket));
                socket.off("open", open);
                socket.off("error", error);
            };

            function error(e: Error) {
                rej(e);
                socket.off("open", open);
                socket.off("error", error);
            };


            socket.on("error", error);
            socket.on("open", open);

        });
    }

    private constructor(socket: WebSocket) {
        super();

        console.log("you good bro?");

        socket.onmessage = (data: object) => {
            console.log(data);
            console.log("you good bro? 4");
        };

        socket.on("message", (data: Buffer) => {
            try {
                const parsedData: Message = JSON.parse(data.toString());

                console.log(data);
                console.log(parsedData);
            } catch (e) {
                console.log("ERRROR", e.message, e.stack, data);
            }
        });

        socket.on("error", this.emit.bind(this, "error"));
    }
}


async function test() {
    console.log("you good bro? number 2");
    const q = await MessageClass.create();
    q.on("message", (e) => {
        console.log(JSON.parse(e.data));
        console.log("you good bro? number 3");
    })
};

if (require.main === module) {
    test();
}
