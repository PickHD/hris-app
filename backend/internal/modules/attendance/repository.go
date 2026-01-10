package attendance

import (
	"time"

	"gorm.io/gorm"
)

type Repository interface {
	GetTodayAttendance(employeeID uint) (*Attendance, error)
	Create(attendance *Attendance) error
	Update(attendance *Attendance) error
	GetHistory(employeeID uint, month, year, page, limit int) ([]Attendance, int64, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) GetTodayAttendance(employeeID uint) (*Attendance, error) {
	var att Attendance

	err := r.db.Where("employee_id = ? AND date = ?", employeeID, time.Now().Format("2006-01-02")).
		First(&att).Error
	if err != nil {
		return nil, err
	}

	return &att, nil
}

func (r *repository) Create(attendance *Attendance) error {
	return r.db.Create(attendance).Error
}

func (r *repository) Update(attendance *Attendance) error {
	return r.db.Save(attendance).Error
}

func (r *repository) GetHistory(employeeID uint, month, year, page, limit int) ([]Attendance, int64, error) {
	var logs []Attendance
	var total int64

	query := r.db.Model(&Attendance{}).
		Where("employee_id = ? AND MONTH(date) = ? AND YEAR(date) = ?", employeeID, month, year)
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	err := query.
		Preload("Shift").
		Order("date DESC").
		Limit(limit).
		Offset(offset).
		Find(&logs).Error

	return logs, total, err
}
