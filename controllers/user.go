package controllers

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/harshau007/mediconnect/database"
	"golang.org/x/crypto/bcrypt"
)

type SignupRequest struct {
	Email        string `json:"email"`
	Password     string `json:"password"`
	FirstName    string `json:"firstName"`
	LastName     string `json:"lastName"`
	Phone        string `json:"phone"`
	AadharNumber string `json:"aadharNumber"`
	Role         string `json:"role"`
}

type SignupResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	UserId  int64  `json:"userId"`
}

func SignUp(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var userReq SignupRequest
		if err := ctx.ShouldBindJSON(&userReq); err != nil {
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

		_, err = qtx.GetUserByEmail(ctx, userReq.Email)
		_, err = qtx.GetUserByPhone(ctx, userReq.Phone)
		_, err = qtx.GetUserByAadhar(ctx, userReq.AadharNumber)
		if err == nil {
			ctx.JSON(400, gin.H{
				"status":  "error",
				"message": "User already exists",
			})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userReq.Password), bcrypt.DefaultCost)
		if err != nil {
			ctx.JSON(500, gin.H{
				"status":  "error",
				"message": "Error hashing password",
			})
			return
		}

		user, err := qtx.CreateUser(ctx, database.CreateUserParams{
			FirstName:    userReq.FirstName,
			LastName:     userReq.LastName,
			Email:        userReq.Email,
			Password:     string(hashedPassword),
			Phone:        userReq.Phone,
			AadharNumber: userReq.AadharNumber,
			Role:         userReq.Role,
			IsEmailVerified: sql.NullBool{
				Bool:  false,
				Valid: true,
			},
		})
		if err != nil {
			ctx.JSON(500, gin.H{
				"status":  "error",
				"message": "Error creating user",
			})
			return
		}
		tx.Commit()

		ctx.JSON(200, SignupResponse{
			Status:  "success",
			Message: "User created successfully",
			UserId:  user.ID,
		})
	}
}

// TODO: Implement Verify User function

// TODO: Implement the Login function with JWT generation
