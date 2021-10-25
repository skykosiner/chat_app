import React from 'react';
import { Message } from 'utils/websocket';
import { send } from "utils/send";
//import MessageClass from 'utils/websocket';

const App: React.FC = () => {
    const [messageSend, setMessageSend] = React.useState("");
    const wsRef = React.useRef();
    const [isPaused, setPause] = React.useState(false);

    function shutUP() {
        console.log(messageSend);
    };

    function getCurrentTime(): string {
        const today = new Date();
        const currentTime = `${today.getHours()}:${today.getMinutes()}`

        return currentTime;
    };

    localStorage.setItem("name", "yoni");
    localStorage.setItem("to_who", "");

    const item: Message = {
        data: {
            user_name: localStorage.getItem("name"),
            message: messageSend,
            time_sent: getCurrentTime(),
            to_who: localStorage.getItem("to_who"),
        },
    };


    React.useEffect(() => {
        const ws = new WebSocket("ws://localhost:42069");

        //@ts-ignore
        wsRef.current = ws;

        console.log("Attempting to connect to socket");

        ws.onopen = () => {
            console.log("Successfully connected");
        };

        ws.close = (event) => {
            console.log("Socket closed connection", event);
        }

        ws.onerror = (error) => {
            console.log("Socket Error:", error);
        };

        ws.onmessage = (e) => {
            console.log(e.data);
        };

    }, [])

    React.useEffect(() => {
        if (!wsRef.current) return;

        //@ts-ignore
        wsRef.current.onmessage = (e: any) => {
            if (isPaused) return;
            const message = JSON.parse(e.data);
            console.log("e", message);
        };
    }, [isPaused]);

    function a() {
        //@ts-ignore
        send(wsRef.current, item);
    };

    return (
        <div>
            <input onChange={(e) => setMessageSend(e.target.value)} />
            {/*@ts-ignore*/}
            <button onClick={a}> SEND MESSAGE</button>
            <button onClick={shutUP}>DON'T PESS</button>
             <button onClick={() => setPause(!isPaused)}>
                {isPaused ? "Resume" : "Pause"}
            </button>
        </div>
   );
}

export default App;
