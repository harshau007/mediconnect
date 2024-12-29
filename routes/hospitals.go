package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/harshau007/mediconnect/controllers"
	"github.com/harshau007/mediconnect/database"
)

func SetupHospitalRoutes(api *gin.RouterGroup, queries *database.Queries, db *sql.DB) {
	hospitals := api.Group("/hospitals")
	{
		hospitals.GET("/", controllers.GetHospitals(queries, db))
		hospitals.POST("/", controllers.CreateHospital(queries, db))
	}
}
