package controllers

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/harshau007/mediconnect/database"
)

func GetHospitals(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tx, err := db.Begin()
		if err != nil {
			ctx.JSON(500, gin.H{
				"status":  "error",
				"message": "Error starting transaction",
			})
			return
		}
		defer tx.Rollback()

		qtx := queries.WithTx(tx)
		hospitals, err := qtx.ListHospitals(ctx, database.ListHospitalsParams{})
		if err != nil {
			ctx.JSON(500, gin.H{
				"status":  "error",
				"message": "Error fetching hospitals",
			})
			return
		}
		tx.Commit()

		ctx.JSON(200, gin.H{
			"status": "success",
			"data":   hospitals,
		})
	}
}

func CreateHospital(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var hospital database.Hospital
		if err := ctx.ShouldBindJSON(&hospital); err != nil {
			ctx.JSON(400, gin.H{
				"status":  "error",
				"message": "Invalid request body",
			})
			return
		}

		tx, err := db.Begin()
		if err != nil {
			ctx.JSON(500, gin.H{
				"status":  "error",
				"message": "Error starting transaction",
			})
			return
		}
		defer tx.Rollback()

		qtx := queries.WithTx(tx)
		hospital, err = qtx.CreateHospital(ctx, database.CreateHospitalParams{
			Name:               hospital.Name,
			Address:            hospital.Address,
			Phone:              hospital.Phone,
			Email:              hospital.Email,
			Website:            hospital.Website,
			VisitingHours:      hospital.VisitingHours,
			IsOpen:             hospital.IsOpen,
			Facilities:         hospital.Facilities,
			QueueLength:        hospital.QueueLength,
			AverageWaitingTime: hospital.AverageWaitingTime,
			CurrentWaitingTime: hospital.CurrentWaitingTime,
			IsCrowded:          hospital.IsCrowded,
		})
		if err != nil {
			ctx.JSON(500, gin.H{
				"status":  "error",
				"message": "Error creating hospital",
			})
			return
		}
		tx.Commit()

		ctx.JSON(201, gin.H{
			"status": "success",
			"data":   hospital,
		})
	}
}
