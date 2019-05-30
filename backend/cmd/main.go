package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"

	"github.com/christer79/shopper/backend/internal/app/shopper"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"

	"github.com/99designs/gqlgen/handler"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
)

const defaultPort = "3500"

func main() {
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

	r := mux.NewRouter()
	r.HandleFunc("/playground", handler.Playground("GraphQL playground", "/graphql")).Methods("GET")
	r.Handle("/graphql", c.Handler(handler.GraphQL(app.NewExecutableSchema(app.Config{Resolvers: &app.Resolver{DB: db}})))).Methods("GET", "POST", "OPTIONS")
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("build/static"))))
	r.PathPrefix("/web").Handler(http.StripPrefix("/", http.FileServer(http.Dir("build"))))
	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, r))

}
