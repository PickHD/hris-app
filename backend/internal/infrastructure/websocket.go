package infrastructure

import (
	"hris-backend/pkg/logger"
	"sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	Hub    *Hub
	UserID uint
	Conn   *websocket.Conn
	Send   chan []byte
}

type Hub struct {
	Clients    map[uint][]*Client
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan Message
	mu         sync.RWMutex
}

type Message struct {
	TargetUserID uint
	Data         []byte
}

func NewHub() *Hub {
	return &Hub{
		Clients:    make(map[uint][]*Client),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast:  make(chan Message),
	}
}

func (h *Hub) Run() {
	logger.Info("Websocket Started...")

	for {
		select {
		case client := <-h.Register:
			h.mu.Lock()
			h.Clients[client.UserID] = append(h.Clients[client.UserID], client)
			h.mu.Unlock()
		case client := <-h.Unregister:
			h.mu.Lock()

			if clients, ok := h.Clients[client.UserID]; ok {
				for i, c := range clients {
					if c == client {
						h.Clients[client.UserID] = append(clients[:i], clients[i+1:]...)
						close(c.Send)
						break
					}
				}

				if len(h.Clients[client.UserID]) == 0 {
					delete(h.Clients, client.UserID)
				}
			}

			h.mu.Unlock()
		case message := <-h.Broadcast:
			h.mu.Lock()

			if clients, ok := h.Clients[message.TargetUserID]; ok {
				for _, client := range clients {
					select {
					case client.Send <- message.Data:
					default:
						close(client.Send)
						delete(h.Clients, client.UserID)
					}
				}
			}

			h.mu.Unlock()
		}
	}
}

func (h *Hub) SendToUser(userID uint, payload []byte) {
	h.Broadcast <- Message{TargetUserID: userID, Data: payload}
}
