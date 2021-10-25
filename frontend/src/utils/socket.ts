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

let socket = new WebSocket("ws://localhost:42069/ws");

socket.onopen = () => {
    console.log("Successfully connected");

    const mesageSend = {
        source: "MESSAGE_USER",
        type: "SEND_MESSAGE",
        data: {
            user_name: "Yoni 2",
            message: "Hello, World!",
            time_sent: "69420",
        }
    };
    socket.send(JSON.stringify(mesageSend));
};

socket.close = (event) => {
    console.log("Socket closed connection", event);
}

socket.onerror = (error) => {
    console.log("Socket Error:", error);
};

socket.onmessage = (e) => {
    console.log(e.data);
    //console.log(JSON.parse(e.toString()));
};

socket.addEventListener("message", (event) => {
    //if (event?.data) {
        //socket.onmessage(JSON.parse(event.toString()));
    //}
    console.log(event.toString());
});

