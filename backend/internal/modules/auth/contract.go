package auth

type Hasher interface {
	HashPassword(password string) (string, error)
	CheckPasswordHash(password, hash string, isNewUser bool) bool
}

type TokenProvider interface {
	GenerateToken(userID uint, role string) (string, error)
}
