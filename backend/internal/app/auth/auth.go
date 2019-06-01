package auth

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"

	"google.golang.org/api/option"
)

type contextKey string

var (
	errLogger           = log.New(os.Stderr, "[ERROR] firebase-middleware-jwthandler: ", log.LstdFlags|log.Lshortfile)
	contextKeyAuthtoken = contextKey("auth-token")
)

// JWTHandler returns a router middleware for JWT token verification using the Firebase SDK
func JWTHandler(credentialsFilePath string) func(next http.Handler) http.Handler {
	// initialise sdk
	opt := option.WithCredentialsFile(credentialsFilePath)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		errLogger.Fatalf("error initializing app: %v\n", err)
	}

	// get auth client
	client, err := app.Auth(context.Background())
	if err != nil {
		errLogger.Fatalf("error getting Auth client: %v\n", err)
	}

	return func(next http.Handler) http.Handler {
		hfn := func(w http.ResponseWriter, r *http.Request) {

			if r.Method == "OPTIONS" {
				next.ServeHTTP(w, r)
				return
			}

			ctx := r.Context()
			token, err := verifyRequest(ctx, client, r)

			if err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte(err.Error()))
				return
			}

			ctx = context.WithValue(ctx, contextKeyAuthtoken, token)

			var user = createUser(token)
			updatedContext := NewContext(ctx, &user)
			next.ServeHTTP(w, r.WithContext(updatedContext))

		}
		return http.HandlerFunc(hfn)
	}
}

func createUser(token *auth.Token) User {

	var user User

	user.UID = token.UID

	return user
}

// verifyRequest extracts and verifies token
func verifyRequest(ctx context.Context, client *auth.Client, r *http.Request) (*auth.Token, error) {
	return client.VerifyIDToken(ctx, tokenFromHeader(r))
}

// tokenFromHeader tries to retreive the token string from the "Authorization"
// reqeust header in the format "Authorization: Bearer TOKEN"
func tokenFromHeader(r *http.Request) string {
	bearer := r.Header.Get("Authorization")
	if len(bearer) > 7 && strings.ToUpper(bearer[0:6]) == "BEARER" {
		return bearer[7:]
	}
	return ""
}
