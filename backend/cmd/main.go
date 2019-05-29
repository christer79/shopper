package main

import (
	"log"
	"net/http"
	"os"

	"github.com/christer79/shopper/backend/internal/app/shopper"
	"github.com/gorilla/mux"

	"github.com/99designs/gqlgen/handler"
)

const defaultPort = "3500"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
	r := mux.NewRouter()
	r.HandleFunc("/playground", handler.Playground("GraphQL playground", "/query")).Methods("GET")
	r.HandleFunc("/query", handler.GraphQL(app.NewExecutableSchema(app.Config{Resolvers: &app.Resolver{}}))).Methods("GET")
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("build/static"))))
	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("build"))))
	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
