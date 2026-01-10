package attendance

import (
	"hris-backend/pkg/logger"
	"time"

	"gorm.io/gorm"
)

type GeocodeJob struct {
	AttendanceID uint
	Latitude     float64
	Longitude    float64
	IsCheckout   bool
}

var GeocodeQueue = make(chan GeocodeJob, 100)

func StartGeocodeWorker(db *gorm.DB, fetcher LocationFetcher) {
	go func() {
		logger.Info("Geocode Worker Started....")

		for job := range GeocodeQueue {
			processJob(db, fetcher, job)

			time.Sleep(1200 * time.Millisecond)
		}

	}()
}

func processJob(db *gorm.DB, fetcher LocationFetcher, job GeocodeJob) {
	address := fetcher.GetAddressFromCoords(job.Latitude, job.Longitude)

	logger.Infof("Address found for ID %d: %s", job.AttendanceID, address)

	var att Attendance
	if err := db.First(&att, job.AttendanceID).Error; err != nil {
		logger.Errorw("Failed to find attendance for geocoding", err)
		return
	}

	if job.IsCheckout {
		att.CheckOutAddress = &address
	} else {
		att.CheckInAddress = address
	}

	if err := db.Model(&att).Updates(att).Error; err != nil {
		logger.Errorw("Failed to update address", err)
	}
}
