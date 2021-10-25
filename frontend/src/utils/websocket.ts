import { EventEmitter } from "events";


import * as WebSocket from "ws";

export type Message = {
    //source: "MESSAGE_USER"
    //type:  "SEND_MESSAGE"
    data: {
        user_name: string,
        message: string,
        time_sent: string
        to_who: string
    };
};

export async function connectToChat(): Promise<WebSocket> {
    return new WebSocket(
        `ws://localhost:42069`
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

        socket.on("message", (data: Buffer) => {
            try {
                const parsedData: Message = JSON.parse(data.toString());

                this.emit("message", {
                    username: parsedData.data.user_name,
                    message: parsedData.data.message,
                    time_sent: parsedData.data.to_who,
                    to_who: parsedData.data.to_who,
                });

            } catch (e) {
                console.log("ERRROR", e.message, e.stack, data);
            }
        });

        socket.on("error", this.emit.bind(this, "error"));
    };
};


async function test() {
    const q = await MessageClass.create();
    q.on("message", (e) => {
        console.log(JSON.stringify(e, null, 4));
    })
    q.on("error", (e) => {
        console.log(e);
    });
};

if (require.main === module) {
    test();
}
