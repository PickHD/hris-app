package company

import "time"

type Company struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"type:varchar(255);not null" json:"name"`
	Address     string    `gorm:"type:text" json:"address"`
	Email       string    `gorm:"type:varchar(255)" json:"email"`
	PhoneNumber string    `gorm:"type:varchar(50)" json:"phone_number"`
	Website     string    `json:"website"`
	TaxNumber   string    `json:"tax_number"`
	LogoURL     string    `json:"logo_url"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (Company) TableName() string {
	return "companies"
}
