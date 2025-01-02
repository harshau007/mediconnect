package main

import (
	"context"
	"database/sql"
	_ "embed"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/harshau007/mediconnect/database"
	"github.com/harshau007/mediconnect/middleware"
	"github.com/harshau007/mediconnect/routes"
	_ "github.com/mattn/go-sqlite3"
)

//go:embed schema.sql
var ddl string

func main() {
	router := gin.Default()

	router.Use(middleware.CORSMiddleware())

	ctx := context.Background()
	db, err := sql.Open("sqlite3", "file:./mediconnect.db?_foreign_keys=on")
	if err != nil {
		log.Fatal("Error opening database connection: ", err)
	}

	if _, err := db.ExecContext(ctx, ddl); err != nil {
		log.Fatal("Error creating table: ", err)
	}
	queries := database.New(db)

	// Serve static files for the frontend
	wd, err := os.Getwd()
	if err != nil {
		log.Fatalf("Error getting working directory: %v", err)
	}
	frontendPath := wd + "/frontend/dist"

	// Ensure the frontend path exists
	if _, err := os.Stat(frontendPath); os.IsNotExist(err) {
		log.Fatalf("Frontend directory does not exist: %s", frontendPath)
	}

	// Serve frontend files under a dedicated route
	router.StaticFS("/static", http.Dir(frontendPath))

	// Define API routes under a specific path prefix
	api := router.Group("/api/v1")
	{
		routes.SetupHospitalRoutes(api, queries, db)
		routes.SetupUserRoutes(api, queries, db)
	}

	// Catch-all route for frontend (e.g., React/SPA fallback)
	router.NoRoute(func(c *gin.Context) {
		filePath := frontendPath + "/index.html"
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			c.String(http.StatusNotFound, "Frontend not built or index.html missing")
			return
		}
		c.File(filePath)
	})

	// Start the server
	log.Println("Server is running on http://localhost:8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
