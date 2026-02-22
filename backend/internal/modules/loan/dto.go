package loan

import (
	"basekarya-backend/pkg/constants"
	"time"
)

type LoanFilter struct {
	UserID uint
	Status string
	Page   int
	Limit  int
}

type LoanRequest struct {
	UserID            uint    `json:"-"`
	EmployeeID        uint    `json:"-"`
	TotalAmount       float64 `json:"total_amount" validate:"required"`
	InstallmentAmount float64 `json:"installment_amount" validate:"required"`
	Reason            string  `json:"reason" validate:"required"`
}

type ActionRequest struct {
	ID              uint   `json:"-"`
	SuperAdminID    uint   `json:"-"`
	Action          string `json:"action" validate:"required"`
	RejectionReason string `json:"rejection_reason" validate:"omitempty"`
}

type LoanListResponse struct {
	ID                uint                 `json:"id"`
	EmployeeID        uint                 `json:"employee_id"`
	EmployeeName      string               `json:"employee_name"`
	EmployeeNIK       string               `json:"employee_nik"`
	TotalAmount       float64              `json:"total_amount"`
	InstallmentAmount float64              `json:"installment_amount"`
	RemainingAmount   float64              `json:"remaining_amount"`
	Status            constants.LoanStatus `json:"status"`
	CreatedAt         time.Time            `json:"created_at"`
}

type LoanDetailResponse struct {
	ID                uint                 `json:"id"`
	EmployeeID        uint                 `json:"employee_id"`
	EmployeeName      string               `json:"employee_name"`
	EmployeeNIK       string               `json:"employee_nik"`
	TotalAmount       float64              `json:"total_amount"`
	InstallmentAmount float64              `json:"installment_amount"`
	RemainingAmount   float64              `json:"remaining_amount"`
	Reason            string               `json:"reason"`
	Status            constants.LoanStatus `json:"status"`
	RejectionReason   string               `json:"rejection_reason"`
	CreatedAt         time.Time            `json:"created_at"`
}
