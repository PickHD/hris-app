package seeder

import (
	"hris-backend/internal/modules/master"
	"hris-backend/internal/modules/user"
	"hris-backend/pkg/logger"

	"gorm.io/gorm"
)

func Execute(db *gorm.DB) error {
	err := db.Transaction(func(tx *gorm.DB) error {
		itDept := master.Department{Name: "Engineering"}
		hrDept := master.Department{Name: "Human Resource"}

		if err := tx.Where(master.Department{Name: "Engineering"}).FirstOrCreate(&itDept).Error; err != nil {
			return err
		}
		if err := tx.Where(master.Department{Name: "Human Resource"}).FirstOrCreate(&hrDept).Error; err != nil {
			return err
		}

		regularShift := master.Shift{Name: "Regular", StartTime: "09:00:00", EndTime: "18:00:00"}
		if err := tx.FirstOrCreate(&regularShift, master.Shift{Name: "Regular"}).Error; err != nil {
			return err
		}

		employeesToSeed := []struct {
			NIK      string
			Name     string
			DeptID   uint
			ShiftID  uint
			Role     string
			IsActive bool
		}{
			{"EMP001", "Taufik Januar", itDept.ID, regularShift.ID, "EMPLOYEE", true},
			{"ADM001", "Super Admin", hrDept.ID, regularShift.ID, "SUPERADMIN", true},
		}

		for _, empData := range employeesToSeed {
			newUser := user.User{
				Username:           empData.NIK,
				PasswordHash:       empData.NIK,
				Role:               empData.Role,
				MustChangePassword: true,
				IsActive:           empData.IsActive,
			}

			if err := tx.Create(&newUser).Error; err != nil {
				logger.Errorf("User %s already exists or error: %v", empData.NIK, err)
				continue
			}
			newEmployee := user.Employee{
				UserID:       newUser.ID,
				DepartmentID: empData.DeptID,
				ShiftID:      empData.ShiftID,
				NIK:          empData.NIK,
				FullName:     empData.Name,
			}

			if err := tx.Create(&newEmployee).Error; err != nil {
				return err
			}

			logger.Infof("Seeded: %s - %s", empData.NIK, empData.Name)
		}

		return nil
	})

	if err != nil {
		logger.Errorf("Seeding failed: %v", err)
		return err
	}

	logger.Info("Database seeding completed successfully!")
	return nil
}
