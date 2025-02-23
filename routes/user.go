package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/harshau007/mediconnect/controllers"
	"github.com/harshau007/mediconnect/database"
	"github.com/harshau007/mediconnect/middleware"
)

func SetupUserRoutes(api *gin.RouterGroup, queries *database.Queries, db *sql.DB) {
	user := api.Group("/user")
	{
		// Auth Routes
		user.POST("/signup", controllers.SignUp(queries, db))
		user.POST("/verify", controllers.VerifyUser(queries, db))
		user.PATCH("/verify", controllers.VerifyOTP(queries, db))
		user.POST("/login", controllers.Login(queries, db))

		user.GET("/profile", middleware.AuthMiddleware(queries, db), controllers.GetMe())
		user.GET("", middleware.AuthMiddleware(queries, db), controllers.GetUserByAadharNumber(queries, db))

		user.PATCH("/update", middleware.AuthMiddleware(queries, db), controllers.UpdateUser(queries, db))
		user.PATCH("/update/password", middleware.AuthMiddleware(queries, db), controllers.ChangePassword(queries, db))
	}
}
