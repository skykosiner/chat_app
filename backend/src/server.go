package main

import (
    "fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan Message)

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
        // Grab the next message from the broadcast channel
        msg := <-broadcast
        log.Print(msg);
        // Send it out to every client that is currently connected
        for client := range clients {
            err := client.WriteJSON(msg)
            if err != nil {
                log.Printf("error: %v", err)
                client.Close()
                delete(clients, client)
            }
        }
    }
};

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
    upgrader.CheckOrigin = func(r *http.Request) bool { return true };

    ws, err := upgrader.Upgrade(w,r , nil);

    // Make sure we close the connection when the function returns
	defer ws.Close()

    clients[ws] = true

    for {
		var msg Message
		// Read in a new message as JSON and map it to a Message object
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients, ws)
			break
		}
		// Send the newly received message to the broadcast channel
		broadcast <- msg
    }

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
