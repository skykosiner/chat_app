package main

import (
    "fmt"
    "log"
    "net/http"
    "strings"

    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{};
var todoList []string;

func getCmd(input string) string {
    inputArr := strings.Split(input, " ");
    //fmt.Print(inputArr);
    return inputArr[0];
};

func getMessage(input string) string {
    inputArr := strings.Split(input, " ")
    var result string;
    for i := 1; i < len(inputArr); i++ {
        result += inputArr[i]
    };

    //fmt.Printf(result);

    return result;
};

func updateTodoList(input string) {
    tmpList := todoList;
    todoList = []string{};
    for _, val := range tmpList {
        if val == input {
            continue
        };
        todoList = append(todoList, val)
        //fmt.Printf(todoList);
        //fmt.Print(todoList);
    };
};

func main() {
    http.HandleFunc("/todo", func(w http.ResponseWriter, r *http.Request) {
        // Upgrade upgrades the HTTP server connection to the WebSocket protocol.
        conn, err := upgrader.Upgrade(w, r, nil)
        if err != nil {
            log.Print("upgrade failed: ", err)
            return
        }
        defer conn.Close()

        // Continuosly read and write message
        for {
            mt, message, err := conn.ReadMessage()
            if err != nil {
                log.Println("read failed:", err)
                break
            };

            input := string(message);
            cmd := getCmd(input);
            msg := getMessage(input);

            if cmd == "add" {
                todoList = append(todoList, msg);
                //fmt.Print(todoList);
            } else if cmd == "done" {
                updateTodoList(msg);
            };
            output := "Current Todos: \n";

            for _, todo := range todoList {
                output += "\n - " + todo + "\n";
                fmt.Print(todo);
            };

            output += "\nDovark btw";
            message = []byte(output);
            err = conn.WriteMessage(mt, message);
            if err != nil {
                log.Println("write failed:", err);
                break;
            };
        };
    });

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, "../index.html")
    })

    http.ListenAndServe(":42069", nil)
}

