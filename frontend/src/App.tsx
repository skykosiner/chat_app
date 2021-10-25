//HOW THE FUCK DOES THIS CODE WORK LOL
import React from 'react';
import { Message } from 'utils/websocket';
import { send } from "utils/send";
import MessageClass from 'utils/websocket';

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


    //@ts-ignore
    React.useEffect(() => {
        async function connect(): Promise<void> {
            const ws = await MessageClass.create()

            //@ts-ignore
            wsRef.current = ws;
        };

        connect();

    }, []);

    React.useEffect(() => {
        if (!wsRef.current) return;

        //@ts-ignore
        wsRef.current.on("message", (e) => {
            if (isPaused) return;
            console.log(JSON.stringify(e, null, 4));
        });
    }, [isPaused]);

    function a() {
        //@ts-ignore
        send(item);
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
};

export default App;
