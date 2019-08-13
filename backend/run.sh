export DATABASE_URL="host=localhost port=5432 user=postgres password=docker dbname=shopping sslmode=disable"
export PORT="3500"
go run cmd/main.go
