package company

import "gorm.io/gorm"

type Repository interface {
	FindByID(id uint) (*Company, error)
	Update(company *Company) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) FindByID(id uint) (*Company, error) {
	var company Company
	err := r.db.
		First(&company, id).Error

	return &company, err
}

func (r *repository) Update(company *Company) error {
	return r.db.Save(company).Error
}
