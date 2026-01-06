package user

import (
	"hris-backend/pkg/logger"

	"gorm.io/gorm"
)

type Repository interface {
	FindByUsername(username string) (*User, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) FindByUsername(username string) (*User, error) {
	var user User

	err := r.db.Preload("Employee").Where("username = ?", username).First(&user).Error
	if err != nil {
		logger.Errorw("UserRepository.FindByUsername ERROR: ", err)

		return nil, err
	}

	return &user, nil
}
