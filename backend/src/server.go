package main

import (
    "fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var clients = make(map[*websocket.Conn]bool)

type Message struct {
    user_name string;
    message string;
    time_sent string;
    to_who string;
}

var upgrader = websocket.Upgrader{
    ReadBufferSize: 1024,
    WriteBufferSize: 1024,
};

func reader(conn *websocket.Conn) {
    for {
        messageType, p, err := conn.ReadMessage();

        if err != nil {
            log.Println(err);
            return;
        };

        log.Println(p);

        for client := range clients {
            if err := client.WriteMessage(messageType, p); err != nil {
                log.Println(err);
            };
        };


    };
};

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
    upgrader.CheckOrigin = func(r *http.Request) bool { return true };

    ws, err := upgrader.Upgrade(w,r , nil);

    clients[ws] = true

    fmt.Print(clients);

    if err != nil {
        log.Println(err);
    };

    log.Println("Client Successfully connected...")

    reader(ws);
};

func setupRoutes() {
    http.HandleFunc("/", wsEndpoint);
};

func main() {
    setupRoutes();

    log.Fatal(http.ListenAndServe(":42069", nil));
};
