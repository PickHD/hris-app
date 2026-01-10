package attendance

import (
	"fmt"
	"hris-backend/pkg/logger"
	"hris-backend/pkg/response"
	"hris-backend/pkg/utils"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service}
}

func (h *Handler) Clock(ctx echo.Context) error {
	userContext, err := utils.GetUserContext(ctx)
	if err != nil {
		return response.NewResponses[any](ctx, http.StatusInternalServerError, err.Error(), nil, err, nil)
	}

	var req ClockRequest
	if err := ctx.Bind(&req); err != nil {
		return response.NewResponses[any](ctx, http.StatusBadRequest, "Invalid Request", nil, err, nil)
	}

	resp, err := h.service.Clock(ctx.Request().Context(), userContext.UserID, &req)
	if err != nil {
		logger.Errorw("Clock Request failed : ", err)

		return response.NewResponses[any](ctx, http.StatusInternalServerError, err.Error(), nil, err, nil)
	}

	return response.NewResponses[any](ctx, http.StatusOK, resp.Message, resp, nil, nil)
}

func (h *Handler) GetTodayStatus(ctx echo.Context) error {
	userContext, err := utils.GetUserContext(ctx)
	if err != nil {
		return response.NewResponses[any](ctx, http.StatusInternalServerError, err.Error(), nil, err, nil)
	}

	resp, err := h.service.GetTodayStatus(ctx.Request().Context(), userContext.UserID)
	if err != nil {
		logger.Errorw("Get Today Status failed: ", err)

		return response.NewResponses[any](ctx, http.StatusInternalServerError, err.Error(), nil, err, nil)
	}

	return response.NewResponses[any](ctx, http.StatusOK, "Get Today Status Success", resp, nil, nil)
}

func (h *Handler) GetHistory(ctx echo.Context) error {
	userContext, err := utils.GetUserContext(ctx)
	if err != nil {
		return response.NewResponses[any](ctx, http.StatusInternalServerError, err.Error(), nil, err, nil)
	}

	// Defaults
	month := int(time.Now().Month())
	year := time.Now().Year()
	page := 1
	limit := 10

	// Parsing Params
	if m := ctx.QueryParam("month"); m != "" {
		fmt.Sscanf(m, "%d", &month)
	}
	if y := ctx.QueryParam("year"); y != "" {
		fmt.Sscanf(y, "%d", &year)
	}
	if p := ctx.QueryParam("page"); p != "" {
		fmt.Sscanf(p, "%d", &page)
	}
	if l := ctx.QueryParam("limit"); l != "" {
		fmt.Sscanf(l, "%d", &limit)
	}

	resp, meta, err := h.service.GetMyHistory(ctx.Request().Context(), userContext.UserID, month, year, page, limit)
	if err != nil {
		logger.Errorw("Get My History failed: ", err)

		return response.NewResponses[any](ctx, http.StatusInternalServerError, err.Error(), nil, err, nil)
	}

	return response.NewResponses[any](ctx, http.StatusOK, "Get My History Success", resp, nil, meta)
}
