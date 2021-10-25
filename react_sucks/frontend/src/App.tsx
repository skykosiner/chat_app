//HOW THE FUCK DOES THIS CODE WORK LOL
import React from 'react';
import { Message } from 'utils/websocket';
import { send } from "utils/send";
import MessageClass from 'utils/websocket';

const App: React.FC = () => {
    const [messageSend, setMessageSend] = React.useState("");
    const [name, setName] = React.useState("");
    const wsRef = React.useRef<MessageClass>();
    const [isPaused, setPause] = React.useState(false);
    const [data, setData] = React.useState("");

    function shutUP() {
        console.log(messageSend);
    };

    function getCurrentTime(): string {
        const today = new Date();
        const currentTime = `${today.getHours()}:${today.getMinutes()}`

        return currentTime;
    };

    localStorage.setItem("to_who", "");

    const item: Message = {
        data: {
            user_name: name,
            message: messageSend,
            time_sent: getCurrentTime(),
            to_who: localStorage.getItem("to_who"),
        },
    };


    React.useEffect(() => {
        async function connect(): Promise<void> {
            const ws = await MessageClass.create()

            wsRef.current = ws;
        };

        connect();

    }, []);

    React.useEffect(() => {
        if (!wsRef.current) return;

        wsRef.current.on("message", (e: Event) => {
            if (isPaused) return;
            const data = e;
            console.log("Javascript only works if I console.log here? fuck you javascript");
            //@ts-ignore
            // eslint-disable-next-line
            setData(`${data.username}:` + ` ${data.message}`);
        });
    }, [isPaused]);

    function a() {
        send(item);
    };

    return (
        <div>
            <input onChange={(e) => setMessageSend(e.target.value)} />
            <input onChange={(e) => setName(e.target.value)} />
            {/*@ts-ignore*/}
            <button onClick={a}> SEND MESSAGE</button>
            <button onClick={shutUP}>DON'T PRESS</button>
            <button onClick={() => setPause(!isPaused)}>
                {isPaused ? "Resume" : "Pause"}
            </button>
            <p dangerouslySetInnerHTML={{__html: data}}></p>
        </div>
   );
};

export default App;
