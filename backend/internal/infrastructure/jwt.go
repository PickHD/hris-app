package infrastructure

import (
	"hris-backend/internal/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JwtProvider struct {
	secretKey      string
	issuer         string
	expireDuration time.Duration
}

func NewJWTProvider(cfg *config.Config) *JwtProvider {
	return &JwtProvider{
		secretKey:      cfg.JWT.Secret,
		issuer:         "hris-app",
		expireDuration: time.Hour * time.Duration(cfg.JWT.ExpiresIn),
	}
}

type MyClaims struct {
	UserID uint   `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func (p *JwtProvider) GenerateToken(userID uint, role string) (string, error) {
	claims := &MyClaims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(p.expireDuration)),
			Issuer:    p.issuer,
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(p.secretKey))
}
