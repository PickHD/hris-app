package master

import "time"

type Department struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	CreatedAt time.Time `json:"created_at"`
}

type Shift struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	StartTime string    `gorm:"not null" json:"start_time"`
	EndTime   string    `gorm:"not null" json:"end_time"`
	CreatedAt time.Time `json:"created_at"`
}

func (Department) TableName() string {
	return "ref_departments"
}

func (Shift) TableName() string {
	return "ref_shifts"
}
