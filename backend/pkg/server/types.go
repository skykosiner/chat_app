package server

type Message struct {
	User     string `json:"user"`
	Message  string `json:"message"`
	Id       int    `json:"id"`
	SentTime string `json:"sent_time"`
}
