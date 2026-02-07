package leave

import (
	"context"
	"errors"
	"hris-backend/internal/modules/attendance"
	"hris-backend/pkg/constants"
	"hris-backend/pkg/response"
	"time"

	"gorm.io/gorm"
)

type Service interface {
	Apply(ctx context.Context, req *ApplyRequest) error
	RequestAction(ctx context.Context, req *LeaveActionRequest) error
	GetList(ctx context.Context, filter *LeaveFilter) ([]LeaveRequestListResponse, *response.Meta, error)
	GetDetail(ctx context.Context, id uint) (*LeaveRequestDetailResponse, error)
	GenerateInitialBalance(ctx context.Context, txObj interface{}, employeeID uint) (*gorm.DB, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo}
}

func (s *service) Apply(ctx context.Context, req *ApplyRequest) error {
	// parse date
	start, err := time.Parse(constants.DefaultTimeFormat, req.StartDate)
	if err != nil {
		return errors.New("invalid start date format")
	}
	end, err := time.Parse(constants.DefaultTimeFormat, req.EndDate)
	if err != nil {
		return errors.New("invalid end date format")
	}

	if end.Before(start) {
		return errors.New("end date must be after start date")
	}

	// calculate total days
	totalDays := int(end.Sub(start).Hours()/24) + 1

	// check balance still available or not
	balance, err := s.repo.GetBalance(req.EmployeeID, req.LeaveTypeID, start.Year())
	if err != nil {
		return err
	}

	if balance.QuotaLeft < totalDays {
		return errors.New("insufficient leave balance")
	}

	// construct leave request and save it to db
	leaveReq := &LeaveRequest{
		UserID:      req.UserID,
		EmployeeID:  req.EmployeeID,
		LeaveTypeID: req.LeaveTypeID,
		StartDate:   start,
		EndDate:     end,
		TotalDays:   totalDays,
		Reason:      req.Reason,
		Status:      constants.LeaveStatusPending,
	}

	return s.repo.CreateRequest(leaveReq)
}

func (s *service) RequestAction(ctx context.Context, req *LeaveActionRequest) error {
	leaveRequest, err := s.repo.FindRequestByID(req.RequestID)
	if err != nil {
		return err
	}

	if leaveRequest.Status != constants.LeaveStatusPending {
		return errors.New("request is not pending")
	}

	switch constants.LeaveAction(req.Action) {
	case constants.LeaveActionApprove:
		shouldDeduct := leaveRequest.LeaveType.IsDeducted
		if shouldDeduct {
			balance, err := s.repo.GetBalance(leaveRequest.EmployeeID, leaveRequest.EmployeeID, leaveRequest.StartDate.Year())
			if err != nil {
				return errors.New("balance record not found for this employee/year")
			}
			if balance.QuotaLeft < leaveRequest.TotalDays {
				return errors.New("insufficient leave balance quota")
			}
		}

		var attendanceRecords []attendance.Attendance

		currentDate := leaveRequest.StartDate
		for !currentDate.After(leaveRequest.EndDate) {

			if currentDate.Weekday() == time.Saturday || currentDate.Weekday() == time.Sunday {
				currentDate = currentDate.AddDate(0, 0, 1)
				continue
			}

			status := constants.AttendanceStatusExcused
			if leaveRequest.LeaveType.Name == "Sick Leave" {
				status = constants.AttendanceStatusSick
			}

			attendance := attendance.Attendance{
				EmployeeID:         leaveRequest.EmployeeID,
				ShiftID:            leaveRequest.Employee.ShiftID,
				CheckInTime:        currentDate,
				CheckInLat:         0,
				CheckInLong:        0,
				CheckInAddress:     "SYSTEM_GENERATED",
				CheckInImageURL:    "",
				Status:             string(status),
				Notes:              "",
				LateDurationMinute: 0,
				IsSuspicious:       false,
			}
			attendanceRecords = append(attendanceRecords, attendance)

			currentDate = currentDate.AddDate(0, 0, 1)
		}

		err := s.repo.ApproveRequest(req.RequestID, req.ApproverID, attendanceRecords, shouldDeduct, leaveRequest.TotalDays)
		if err != nil {
			return err
		}
	case constants.LeaveActionReject:
		if req.RejectionReason == "" {
			return errors.New("rejection reason required")
		}

		err := s.repo.RejectRequest(req.RequestID, req.ApproverID, req.RejectionReason)
		if err != nil {
			return err
		}
	default:
		return errors.New("invalid action")
	}

	return nil
}

func (s *service) GetList(ctx context.Context, filter *LeaveFilter) ([]LeaveRequestListResponse, *response.Meta, error) {
	requests, total, err := s.repo.FindAllRequests(filter)
	if err != nil {
		return []LeaveRequestListResponse{}, nil, nil
	}

	if len(requests) == 0 {
		return []LeaveRequestListResponse{}, nil, nil
	}

	var list []LeaveRequestListResponse
	for _, req := range requests {
		list = append(list, LeaveRequestListResponse{
			ID:        req.ID,
			StartDate: req.StartDate,
			EndDate:   req.EndDate,
			TotalDays: req.TotalDays,
			Reason:    req.Reason,
			Status:    req.Status,
		})
	}

	meta := response.NewMeta(filter.Page, filter.Limit, total)
	return list, meta, nil
}

func (s *service) GetDetail(ctx context.Context, id uint) (*LeaveRequestDetailResponse, error) {
	detail, err := s.repo.FindRequestByID(id)
	if err != nil {
		return nil, err
	}

	if detail.Employee == nil {
		return nil, errors.New("employee not found")
	}

	return &LeaveRequestDetailResponse{
		ID:              id,
		StartDate:       detail.StartDate,
		EndDate:         detail.EndDate,
		TotalDays:       detail.TotalDays,
		Reason:          detail.Reason,
		AttachmentURL:   detail.AttachmentURL,
		Status:          detail.Status,
		RejectionReason: detail.RejectionReason,
		RequesterName:   detail.Employee.FullName,
	}, nil
}

func (s *service) GenerateInitialBalance(ctx context.Context, txObj interface{}, employeeID uint) (*gorm.DB, error) {
	tx, ok := txObj.(*gorm.DB)
	if !ok {
		return nil, errors.New("invalid transaction type")
	}

	var leaveTypes []LeaveType
	if err := tx.Find(&leaveTypes).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	currentYear := time.Now().Year()
	var balances []LeaveBalance

	for _, lt := range leaveTypes {
		quota := lt.DefaultQuota

		if lt.Name == "Annual Leave" {
			currentMonth := int(time.Now().Month())
			remainingMonths := 12 - currentMonth + 1
			quota = (lt.DefaultQuota * remainingMonths) / 12
		}

		balances = append(balances, LeaveBalance{
			EmployeeID:  employeeID,
			LeaveTypeID: lt.ID,
			Year:        currentYear,
			QuotaTotal:  quota,
			QuotaUsed:   0,
			QuotaLeft:   quota,
		})
	}

	if len(balances) > 0 {
		if err := tx.Create(&balances).Error; err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	return tx, nil
}
