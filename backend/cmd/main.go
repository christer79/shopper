package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/christer79/shopper/backend/internal/app/shopper"
	"github.com/gorilla/mux"

	"github.com/99designs/gqlgen/handler"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
)

const defaultPort = "3500"

const (
	host         = "localhost"
	port         = 5432
	user         = "postgres"
	password     = "docker"
	dbname       = "shopping"
	initializeDB = false
)

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
	r := mux.NewRouter()
	r.HandleFunc("/", handler.Playground("GraphQL playground", "/graphql")).Methods("GET")
	r.HandleFunc("/graphql", handler.GraphQL(app.NewExecutableSchema(app.Config{Resolvers: &app.Resolver{DB: db}}))).Methods("GET")
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("build/static"))))
	r.PathPrefix("/web").Handler(http.StripPrefix("/", http.FileServer(http.Dir("build"))))
	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
