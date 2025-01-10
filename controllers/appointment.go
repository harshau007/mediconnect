package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/harshau007/mediconnect/database"
)

func GetAppointmentByID(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		idType := ctx.Query("type")

		switch idType {
		case "appointment":
			id := ctx.Query("id")
			parsedId, err := strconv.ParseInt(id, 10, 64)
			appointment, err := queries.GetAppointmentByID(ctx, parsedId)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"status":  "error",
					"message": fmt.Sprintf("Error fetching appointment: %s", err.Error()),
				})
				return
			}
			ctx.JSON(http.StatusOK, gin.H{
				"status": "success",
				"data":   appointment,
			})
			break
		case "user":
			id := ctx.Query("id")
			parsedId, err := strconv.ParseInt(id, 10, 64)

			_, err = queries.GetUserByID(ctx, parsedId)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"status":  "error",
					"message": fmt.Sprintf("Error fetching user: %s", err.Error()),
				})
				return
			}

			appointment, err := queries.ListAppointments(ctx, database.ListAppointmentsParams{
				UserID: parsedId,
			})

			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"status":  "error",
					"message": fmt.Sprintf("Error fetching appointment: %s", err.Error()),
				})
				return
			}
			ctx.JSON(http.StatusOK, gin.H{
				"status": "success",
				"data":   appointment,
			})
			break
		case "hospital":
			id := ctx.Query("id")
			parsedId, err := strconv.ParseInt(id, 10, 64)

			_, err = queries.GetHospital(ctx, parsedId)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"status":  "error",
					"message": fmt.Sprintf("Error fetching hospital: %s", err.Error()),
				})
				return
			}

			appointment, err := queries.ListAppointments(ctx, database.ListAppointmentsParams{
				HospitalID: parsedId,
			})
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"status":  "error",
					"message": fmt.Sprintf("Error fetching appointment: %s", err.Error()),
				})
				return
			}

			ctx.JSON(http.StatusOK, gin.H{
				"status": "success",
				"data":   appointment,
			})
			break
		}
	}
}

type CreateAppointmentRequest struct {
	UserID          int64  `json:"userId"`
	HospitalID      int64  `json:"hospitalId"`
	AppointmentDate string `json:"appointmentDate"`
	AppointmentTime string `json:"appointmentTime"`
}

func CreateAppointment(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var userReq CreateAppointmentRequest
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

		parsedDate, err := time.Parse("2006-01-02", userReq.AppointmentDate)
		parsedTime, err := time.Parse("15:04", userReq.AppointmentTime)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": fmt.Sprintf("Error parsing date/time: %s", err.Error()),
			})
			return
		}

		// Check if user and hospital is verified and valid
		user, err := qtx.GetUserByID(ctx, userReq.UserID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": fmt.Sprintf("Error fetching user: %s", err.Error()),
			})
			return
		}
		if !user.IsVerified.Bool {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "User is not verified",
			})
			return
		}

		hospital, err := qtx.GetHospital(ctx, userReq.HospitalID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": fmt.Sprintf("Error fetching hospital: %s", err.Error()),
			})
			return
		}
		if !hospital.IsVerified.Bool {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "Hospital is not verified",
			})
			return
		}

		// Check if the appointment is already booked
		count, err := qtx.CheckAppointmentExists(ctx, database.CheckAppointmentExistsParams{
			UserID:          user.ID,
			HospitalID:      hospital.ID,
			AppointmentDate: parsedDate,
			AppointmentTime: parsedTime,
		})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": fmt.Sprintf("Error fetching appointment: %s", err.Error()),
			})
			return
		}
		if count > 1 {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "Appointment already booked",
			})
			return
		}

		appointment, err := qtx.CreateAppointment(ctx, database.CreateAppointmentParams{
			UserID:          user.ID,
			HospitalID:      hospital.ID,
			HospitalName:    hospital.Name,
			DoctorName:      "",
			AppointmentDate: parsedDate,
			AppointmentTime: parsedTime,
			Status:          "pending",
		})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": fmt.Sprintf("Error creating appointment: %s", err.Error()),
			})
			return
		}

		tx.Commit()

		ctx.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data":   appointment,
		})
	}
}
