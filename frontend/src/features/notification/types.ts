export interface NotificationPayload {
  type: "APPROVED" | "REJECTED";
  title: string;
  message: string;
  timestamp?: string;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
}
