package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/harshau007/mediconnect/controllers"
	"github.com/harshau007/mediconnect/database"
)

func SetupUserRoutes(api *gin.RouterGroup, queries *database.Queries, db *sql.DB) {
	hospitals := api.Group("/user")
	{
		hospitals.POST("/signup", controllers.SignUp(queries, db))
	}
}
