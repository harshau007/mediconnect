package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/harshau007/mediconnect/controllers"
	"github.com/harshau007/mediconnect/database"
	"github.com/harshau007/mediconnect/middleware"
)

func SetupHospitalRoutes(api *gin.RouterGroup, queries *database.Queries, db *sql.DB) {
	hospitals := api.Group("/hospitals")
	hospitals.Use(middleware.AuthMiddleware(queries, db))
	{
		hospitals.GET("/", controllers.GetHospitals(queries, db))
		hospitals.GET("/unverified", controllers.GetUnVerifiedHospitals(queries, db))

		hospitals.POST("/", controllers.CreateHospital(queries, db))

		hospitals.PATCH("/verify", controllers.VerifyHospital(queries, db))
	}
}
