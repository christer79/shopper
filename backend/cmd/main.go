package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"

	"github.com/christer79/shopper/backend/internal/app/auth"
	"github.com/christer79/shopper/backend/internal/app/shopper"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"

	"github.com/99designs/gqlgen/handler"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"

	firebase "firebase.google.com/go"
	"golang.org/x/net/context"
	"google.golang.org/api/option"
)

const defaultPort = "3500"

func main() {

	opt := option.WithCredentialsFile("config/serviceAccountKey.json")
	fbapp, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		panic(err)
	}
	log.Printf("%v\n", fbapp)

	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Error opening database: %q", err)
		panic(err)
	}
	err = db.Ping()
	if err != nil {
		panic(err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	c := cors.New(cors.Options{
		AllowedOrigins:     []string{"*"}, // "http://localhost:3000", "http://localhost:3500"
		AllowedMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions, http.MethodPatch},
		AllowedHeaders:     []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Connection"},
		ExposedHeaders:     []string{"Link", "Connection", "Upgrade", "Sec-WebSocket-Key", "Sec-WebSocket-Version"},
		AllowCredentials:   true,
		Debug:              true,
		OptionsPassthrough: true,
	})

	authFunc := auth.JWTHandler("config/serviceAccountKey.json")
	router := mux.NewRouter()
	router.HandleFunc("/playground", handler.Playground("GraphQL playground", "/graphql")).Methods("GET")
	router.Handle("/graphql", c.Handler(authFunc(handler.GraphQL(app.NewExecutableSchema(app.Config{Resolvers: &app.Resolver{DB: db}}))))).Methods("GET", "POST", "OPTIONS")
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("build/static"))))
	router.PathPrefix("/web").Handler(http.StripPrefix("/", http.FileServer(http.Dir("build"))))
	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))

}
