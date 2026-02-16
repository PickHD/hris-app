package notification

import (
	"encoding/json"
	"hris-backend/internal/infrastructure"
)

type Service interface {
	SendNotification(userID uint,
		Type string,
		Title string,
		Message string) error
}

type service struct {
	wsHub *infrastructure.Hub
}

func NewService(wsHub *infrastructure.Hub) Service {
	return &service{wsHub}
}

func (s *service) SendNotification(userID uint,
	notifType string,
	title string,
	message string) error {

	payload := NotificationRequest{
		UserID:  userID,
		Type:    notifType,
		Title:   title,
		Message: message,
	}

	data, err := json.Marshal(&payload)
	if err != nil {
		return err
	}

	s.wsHub.SendToUser(payload.UserID, data)

	return nil
}
