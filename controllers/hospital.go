package controllers

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/harshau007/mediconnect/database"
)

func GetHospitals(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tx, err := db.Begin()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Error starting transaction",
			})
			return
		}
		defer tx.Rollback()

		qtx := queries.WithTx(tx)
		hospitals, err := qtx.ListVerifiedHospitals(ctx, database.ListVerifiedHospitalsParams{})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Error fetching hospitals",
			})
			return
		}
		tx.Commit()

		ctx.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data":   hospitals,
		})
	}
}

func GetUnVerifiedHospitals(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tx, err := db.Begin()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Error starting transaction",
			})
			return
		}
		defer tx.Rollback()

		qtx := queries.WithTx(tx)
		hospitals, err := qtx.ListUnverifiedHospitals(ctx, database.ListUnverifiedHospitalsParams{})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Error fetching hospitals",
			})
			return
		}
		tx.Commit()

		ctx.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data":   hospitals,
		})
	}
}

func CreateHospital(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var hospital database.Hospital
		if err := ctx.ShouldBindJSON(&hospital); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "Invalid request body",
			})
			return
		}

		tx, err := db.Begin()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
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
			IsVerified: sql.NullBool{
				Bool:  false,
				Valid: true,
			},
		})
		if err != nil {
			fmt.Println(err)
			ctx.JSON(http.StatusInternalServerError, gin.H{
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

type VerifyHospitalRequest struct {
	ID         int64 `json:"id"`
	IsVerified bool  `json:"isVerified"`
}

func VerifyHospital(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var userReq VerifyHospitalRequest
		if err := ctx.ShouldBindJSON(&userReq); err != nil {
			fmt.Println(err)
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "Invalid request body",
			})
			return
		}

		tx, err := db.Begin()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Error starting transaction",
			})
			return
		}
		defer tx.Rollback()

		qtx := queries.WithTx(tx)
		err = qtx.VerifyHospital(ctx, database.VerifyHospitalParams{
			ID: userReq.ID,
			IsVerified: sql.NullBool{
				Bool:  userReq.IsVerified,
				Valid: true,
			},
		})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Error verifying hospital",
			})
			return
		}
		tx.Commit()

		ctx.JSON(http.StatusOK, gin.H{
			"status": "success",
		})
	}
}
