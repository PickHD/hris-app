package response

import (
	"math"

	"github.com/labstack/echo/v4"
)

type (
	baseResponse struct {
		Message string `json:"message"`
		Data    any    `json:"data"`
		Error   any    `json:"error"`
		Meta    *Meta  `json:"meta,omitempty"`
	}

	Meta struct {
		Page      int   `json:"page"`
		Limit     int   `json:"limit"`
		TotalPage int64 `json:"total_page"`
		TotalData int64 `json:"total_data"`
	}
)

// NewResponses return dynamic JSON responses
func NewResponses[T any](ctx echo.Context, statusCode int, message string, data T, err error, meta *Meta) error {
	var errVal any
	if err != nil {
		errVal = err.Error()
	}

	if statusCode < 400 {
		return ctx.JSON(statusCode, &baseResponse{
			Message: message,
			Data:    data,
			Error:   nil,
			Meta:    meta,
		})

	}

	return ctx.JSON(statusCode, &baseResponse{
		Message: message,
		Data:    data,
		Error:   errVal,
		Meta:    nil,
	})
}

func NewMeta(page, limit int, totalData int64) *Meta {
	totalPage := int64(math.Ceil(float64(totalData) / float64(limit)))
	return &Meta{
		Page:      page,
		Limit:     limit,
		TotalPage: totalPage,
		TotalData: totalData,
	}
}
