package notification

import (
	"hris-backend/internal/infrastructure"
	"hris-backend/pkg/response"
	"hris-backend/pkg/utils"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	wsHub *infrastructure.Hub
}

func NewHandler(wsHub *infrastructure.Hub) *Handler {
	return &Handler{wsHub}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (h *Handler) HandleWebSocket(ctx echo.Context) error {
	userContext, err := utils.GetUserContext(ctx)
	if err != nil {
		return response.NewResponses[any](ctx, http.StatusInternalServerError, err.Error(), nil, err, nil)
	}

	conn, err := upgrader.Upgrade(ctx.Response(), ctx.Request(), nil)
	if err != nil {
		return err
	}

	client := &infrastructure.Client{Hub: h.wsHub, UserID: userContext.UserID, Conn: conn, Send: make(chan []byte, 256)}
	client.Hub.Register <- client

	go func() {
		defer func() {
			client.Hub.Unregister <- client
			client.Conn.Close()
		}()

		for message := range client.Send {

			err := client.Conn.WriteMessage(websocket.TextMessage, message)
			if err != nil {
				break
			}
		}

		client.Conn.WriteMessage(websocket.CloseMessage, []byte{})
	}()

	for {
		if _, _, err := client.Conn.ReadMessage(); err != nil {
			break
		}
	}

	return nil
}
