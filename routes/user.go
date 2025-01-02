package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/harshau007/mediconnect/controllers"
	"github.com/harshau007/mediconnect/database"
)

func SetupUserRoutes(api *gin.RouterGroup, queries *database.Queries, db *sql.DB) {
	user := api.Group("/user")
	{
		user.POST("/signup", controllers.SignUp(queries, db))
		user.POST("/verify", controllers.VerifyUser(queries, db))
		user.PATCH("/verify", controllers.VerifyOTP(queries, db))
	}
}
