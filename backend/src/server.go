package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize: 1024,
    WriteBufferSize: 1024,
};

func homePage(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "home page");
};

func reader(conn *websocket.Conn) {
    for {
        messageType, p, err := conn.ReadMessage();
        if err != nil {
            log.Println(err);
            return;
        };

        log.Println(p);

        if err := conn.WriteMessage(messageType, p); err != nil {
            log.Println(err);
        };
    };
};

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
    upgrader.CheckOrigin = func(r *http.Request) bool { return true };

    ws, err := upgrader.Upgrade(w,r , nil);

    if err != nil {
        log.Println(err);
    };

    log.Println("Client Successfully connected...")

    reader(ws);
};

func setupRoutes() {
    http.HandleFunc("/", homePage);
    http.HandleFunc("/ws", wsEndpoint);
};

func main() {
    setupRoutes();

    log.Fatal(http.ListenAndServe(":42069", nil));
};
