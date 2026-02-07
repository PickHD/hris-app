package leave

import (
	"hris-backend/pkg/constants"
	"time"
)

type ApplyRequest struct {
	UserID      uint   `json:"-"`
	EmployeeID  uint   `json:"-"`
	LeaveTypeID uint   `json:"leave_type_id" validate:"required"`
	StartDate   string `json:"start_date" validate:"required"`
	EndDate     string `json:"end_date" validate:"required"`
	Reason      string `json:"reason" validate:"required"`
}

type LeaveActionRequest struct {
	RequestID       uint   `json:"-"`
	ApproverID      uint   `json:"-"`
	Action          string `json:"action" validate:"required"`
	RejectionReason string `json:"rejection_reason" validate:"omitempty"`
}

type LeaveFilter struct {
	Page   int    `json:"page"`
	Limit  int    `json:"limit"`
	Status string `json:"status"`
	Search string `json:"search"`
	UserID uint   `json:"-"`
}

type LeaveRequestListResponse struct {
	ID        uint                  `json:"id"`
	StartDate time.Time             `json:"start_date"`
	EndDate   time.Time             `json:"end_date"`
	TotalDays int                   `json:"total_days"`
	Reason    string                `json:"reason"`
	Status    constants.LeaveStatus `json:"status"`
}

type LeaveRequestDetailResponse struct {
	ID              uint                  `json:"id"`
	StartDate       time.Time             `json:"start_date"`
	EndDate         time.Time             `json:"end_date"`
	TotalDays       int                   `json:"total_days"`
	Reason          string                `json:"reason"`
	AttachmentURL   string                `json:"attachment_url"`
	Status          constants.LeaveStatus `json:"status"`
	RejectionReason string                `json:"rejection_reason"`
	RequesterName   string                `json:"requester_name"`
}
