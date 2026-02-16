package notification

type NotificationRequest struct {
	UserID  uint   `json:"user_id"`
	Type    string `json:"type"`
	Title   string `json:"title"`
	Message string `json:"message"`
}
