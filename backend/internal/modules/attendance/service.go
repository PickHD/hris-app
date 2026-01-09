package attendance

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"hris-backend/internal/modules/user"
	"hris-backend/pkg/constants"
	"hris-backend/pkg/utils"
	"time"

	"gorm.io/gorm"
)

type Service interface {
	Clock(ctx context.Context, userID uint, req *ClockRequest) (*AttendanceResponse, error)
	GetTodayStatus(ctx context.Context, userID uint) (*TodayStatusResponse, error)
}

type service struct {
	repo     Repository
	userRepo user.Repository
	storage  StorageProvider
	location LocationFetcher
}

func NewService(repo Repository, userRepo user.Repository, storage StorageProvider, location LocationFetcher) Service {
	return &service{repo, userRepo, storage, location}
}

func (s *service) Clock(ctx context.Context, userID uint, req *ClockRequest) (*AttendanceResponse, error) {
	u, err := s.userRepo.FindByID(userID)
	if err != nil || u.Employee == nil {
		return nil, errors.New("employee data not found")
	}

	employee := u.Employee

	if employee.Shift == nil {
		return nil, errors.New("employee shift not assigned")
	}

	imgBytes, err := utils.DecodeBase64Image(req.ImageBase64)
	if err != nil {
		return nil, errors.New("invalid image")
	}
	imageReader := bytes.NewReader(imgBytes)

	// set address temporary
	tempAddress := fmt.Sprintf("Processing location... (%f, %f)", req.Latitude, req.Longitude)

	todayAtt, err := s.repo.GetTodayAttendance(employee.ID)

	now := time.Now()
	todayString := now.Format(constants.DefaultTimeFormat)
	fileName := fmt.Sprintf("attendance/%d/%s-%d.jpg", employee.ID, todayString, now.Unix())

	if errors.Is(err, gorm.ErrRecordNotFound) {
		// if today no data, its check-in of that employee
		imgUrl, err := s.storage.UploadFileByte(ctx, fmt.Sprintf("in-%s", fileName), imageReader, int64(len(imgBytes)), "image/jpg")
		if err != nil {
			return nil, err
		}

		// calculate status is LATE or PRESENT
		shiftStart, _ := time.Parse(constants.AttendanceTimeFormat, employee.Shift.StartTime)

		lateThreshold := shiftStart.Add(15 * time.Minute)

		status := string(constants.AttendanceStatusPresent)
		clockInTimeOnly, _ := time.Parse(constants.AttendanceTimeFormat, now.Format(constants.AttendanceTimeFormat))

		// compare current time with shift time, if more than late threshold, status will changed to LATE
		if clockInTimeOnly.After(lateThreshold) {
			status = string(constants.AttendanceStatusLate)
		}

		newAtt := &Attendance{
			EmployeeID:      employee.ID,
			ShiftID:         employee.ShiftID,
			Date:            time.Now(),
			CheckInTime:     now,
			CheckInLat:      req.Latitude,
			CheckInLong:     req.Longitude,
			CheckInImageURL: imgUrl,
			CheckInAddress:  tempAddress,
			Status:          status,
			Notes:           req.Notes,
			IsSuspicious:    false,
		}

		if err := s.repo.Create(newAtt); err != nil {
			return nil, err
		}

		// process this attendance (check-in) to geocode worker queue
		GeocodeQueue <- GeocodeJob{
			AttendanceID: newAtt.ID,
			Latitude:     req.Latitude,
			Longitude:    req.Longitude,
			IsCheckout:   false,
		}

		return &AttendanceResponse{
			Type:    string(constants.AttendanceTypeCheckIn),
			Status:  status,
			Time:    now,
			Message: "Check-in succesful",
		}, nil
	}

	if todayAtt != nil && todayAtt.CheckOutTime == nil {
		// if today already have attendance, but the checkout time is still null, its checkout of that employee
		imgUrl, err := s.storage.UploadFileByte(ctx, fmt.Sprintf("out-%s", fileName), imageReader, int64(len(imgBytes)), "image/jpg")
		if err != nil {
			return nil, err
		}

		distanceMeters := utils.CalculateDistance(todayAtt.CheckInLat, todayAtt.CheckInLong, req.Latitude, req.Longitude)
		distanceKm := distanceMeters / 1000.0

		durationHours := time.Since(todayAtt.CheckInTime).Hours()

		isSuspicious := false
		notes := ""

		if durationHours > 0.01 {
			speedKmH := distanceKm / durationHours

			if speedKmH > 200 && distanceKm > 2.0 {
				isSuspicious = true
				notes = fmt.Sprintf("[SUSPICIOUS] Speed %.2f km/h detected. Teleportation check failed.", speedKmH)
			}
		}

		todayAtt.CheckOutTime = &now
		todayAtt.CheckOutLat = &req.Latitude
		todayAtt.CheckOutLong = &req.Longitude
		todayAtt.CheckOutImageURL = &imgUrl
		todayAtt.CheckOutAddress = &tempAddress

		if isSuspicious {
			todayAtt.IsSuspicious = true
			todayAtt.Notes = todayAtt.Notes + " " + notes
		}

		if err := s.repo.Update(todayAtt); err != nil {
			return nil, err
		}

		// process this attendance (check-out) to geocode worker queue
		GeocodeQueue <- GeocodeJob{
			AttendanceID: todayAtt.ID,
			Latitude:     req.Latitude,
			Longitude:    req.Longitude,
			IsCheckout:   true,
		}

		return &AttendanceResponse{
			Type:    string(constants.AttendanceTypeCheckOut),
			Status:  todayAtt.Status,
			Time:    now,
			Message: "Check-out successful",
		}, nil
	}

	return nil, errors.New("you have already completed attendance for today")
}

func (s *service) GetTodayStatus(ctx context.Context, userID uint) (*TodayStatusResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil || user.Employee == nil {
		return nil, errors.New("employee not found")
	}

	att, err := s.repo.GetTodayAttendance(user.Employee.ID)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return &TodayStatusResponse{
			Status: string(constants.AttendanceAStatusAbsent),
			Type:   string(constants.AttendanceTypeNone),
		}, nil
	}
	if err != nil {
		return nil, err
	}

	if att.CheckOutTime == nil {
		return &TodayStatusResponse{
			Status:      att.Status,
			Type:        string(constants.AttendanceTypeCheckIn),
			CheckInTime: &att.CheckInTime,
		}, nil
	}

	duration := att.CheckOutTime.Sub(att.CheckInTime).String()

	return &TodayStatusResponse{
		Status:       att.Status,
		Type:         string(constants.AttendanceTypeCompleted),
		CheckInTime:  &att.CheckInTime,
		CheckOutTime: att.CheckOutTime,
		WorkDuration: duration,
	}, nil
}
