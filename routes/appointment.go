package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/harshau007/mediconnect/controllers"
	"github.com/harshau007/mediconnect/database"
	"github.com/harshau007/mediconnect/middleware"
)

func SetupAppointmentRoutes(api *gin.RouterGroup, queries *database.Queries, db *sql.DB) {
	appointment := api.Group("/appointment")
	appointment.Use(middleware.AuthMiddleware(queries, db))
	{
		appointment.GET("/", controllers.GetAppointmentByID(queries, db))
		appointment.POST("/", controllers.CreateAppointment(queries, db))
	}
}
