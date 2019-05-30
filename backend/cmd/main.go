package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/christer79/shopper/backend/internal/app/shopper"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"

	"github.com/99designs/gqlgen/handler"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/lib/pq"
)

const defaultPort = "8080"

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
	r.HandleFunc("/playground", handler.Playground("GraphQL playground", "/graphql")).Methods("GET")
	r.HandleFunc("/graphql", handler.GraphQL(app.NewExecutableSchema(app.Config{Resolvers: &app.Resolver{DB: db}}))).Methods("GET", "POST")
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("build/static"))))
	r.PathPrefix("/web").Handler(http.StripPrefix("/", http.FileServer(http.Dir("build"))))
	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, r))

}
