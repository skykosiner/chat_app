import { EventEmitter } from "events";

export type Message = {
    //source: "MESSAGE_USER"
    //type:  "SEND_MESSAGE"
    data: {
        user_name: string | null,
        message: string,
        time_sent: string,
        to_who: string | null
    };
};

export async function connectToChat(): Promise<WebSocket> {
    return new WebSocket(
        `ws://localhost:42069`
    );
};

export function waitForSocketConnection(socket: WebSocket, callback: any){
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                if (callback != null) {
                    callback();
                };
            } else {
                waitForSocketConnection(socket, callback);
            }

        }, 5); // wait 5 milisecond for the connection...
}

export default class MessageClass extends EventEmitter {

    static create(): Promise<MessageClass> {
        return new Promise(async (res) => {
            const socket = await connectToChat();
            res(new MessageClass(socket));
        });
    }

    public async send(socket: WebSocket, item: Message) {
        const msgStr = JSON.stringify(item);

        waitForSocketConnection(socket, function() {
            socket.send(msgStr);
        })
    };

    constructor(socket: WebSocket) {
        super();


        socket.onmessage = (data) => {
            try {
                const dataStr = data.data;
                const parsedData: Message = JSON.parse(dataStr.toString());

                this.emit("message", {
                    username: parsedData.data.user_name,
                    message: parsedData.data.message,
                    time_sent: parsedData.data.to_who,
                    to_who: parsedData.data.to_who,
                });

            } catch (e) {
                console.log("ERROR", e);
            };
        }
        socket.onerror = (error) => {
            this.emit("error", {
                error: error,
            });
        };
    };
};


async function test() {
    const q = await MessageClass.create();
    q.on("message", (e) => {
        console.log("q", e);
    })
    q.on("error", (e) => {
        console.log("q", e);
    });
};

if (require.main === module) {
    test();
}
