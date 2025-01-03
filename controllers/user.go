package controllers

import (
	"crypto/rand"
	"database/sql"
	"fmt"
	"math/big"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
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
			IsVerified: sql.NullBool{
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

type VerifyUserRequest struct {
	Phone string `json:"phone"`
}

type VerifyUserResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func VerifyUser(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var userReq VerifyUserRequest
		if err := ctx.ShouldBindJSON(&userReq); err != nil {
			ctx.JSON(http.StatusNotAcceptable, gin.H{
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

		user, err := qtx.GetUserByPhone(ctx, userReq.Phone)
		if err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "User not found",
			})
			return
		}

		if otp, err := qtx.GetOTPByUserID(ctx, user.ID); err == nil {
			err = qtx.DeleteOTP(ctx, otp.ID)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{
					"status":  "error",
					"message": "Error deleting existing OTP",
				})
				return
			}
		}

		otp, err := qtx.CreateOTP(ctx, database.CreateOTPParams{
			UserID:    user.ID,
			OtpNumber: generateOTP(),
		})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Error creating OTP",
			})
			return
		}

		// TODO: Send OTP to mobile number
		fmt.Println(otp.OtpNumber)
		tx.Commit()

		ctx.JSON(http.StatusOK, VerifyUserResponse{
			Status:  "success",
			Message: "OTP sent successfully",
		})
	}
}
func generateOTP() string {
	const max = 1000000

	n, err := rand.Int(rand.Reader, big.NewInt(max))
	if err != nil {
		fmt.Printf("failed to generate OTP: %v", err)
	}

	return fmt.Sprintf("%06d", n.Int64())
}

type VerifyOTPRequest struct {
	Phone string `json:"phone"`
	OTP   string `json:"otp"`
}

type VerifyOTPResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func VerifyOTP(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var userReq VerifyOTPRequest
		if err := ctx.ShouldBindJSON(&userReq); err != nil {
			ctx.JSON(http.StatusNotAcceptable, gin.H{
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

		user, err := qtx.GetUserByPhone(ctx, userReq.Phone)
		if err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "user does not exist",
			})
			return
		}

		if user.IsVerified.Bool {
			ctx.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "user already verified",
			})
			return
		}

		otp, err := qtx.GetOTPByUserID(ctx, user.ID)
		if err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "otp does not exist",
			})
			return
		}

		if strings.TrimSpace(otp.OtpNumber) != strings.TrimSpace(userReq.OTP) {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "otp mismatch",
			})
			return
		}

		_, err = qtx.UpdateEmailVerified(ctx, database.UpdateEmailVerifiedParams{
			ID: user.ID,
			IsVerified: sql.NullBool{
				Bool:  true,
				Valid: true,
			},
		})
		if err != nil {
			fmt.Println(err)
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "failed in updating user",
			})
			return
		}

		err = qtx.DeleteOTP(ctx, otp.ID)
		if err != nil {
			fmt.Println(err)
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "failed in deleting otp",
			})
			return
		}
		tx.Commit()

		ctx.JSON(http.StatusAccepted, VerifyOTPResponse{
			Status:  "success",
			Message: "User verified",
		})
	}
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func Login(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var userReq LoginRequest
		if err := ctx.ShouldBindJSON(&userReq); err != nil {
			ctx.JSON(http.StatusNotAcceptable, gin.H{
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

		user, err := qtx.GetUserByEmail(ctx, userReq.Email)
		if err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "User not found",
			})
			return
		}

		if !user.IsVerified.Bool {
			ctx.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "User not verified",
			})
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userReq.Password))
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"status":  "error",
				"message": "Invalid password",
			})
			return
		}

		token := GenerateToken(map[string]string{
			"id": fmt.Sprintf("%d", user.ID),
		})

		ctx.JSON(http.StatusOK, LoginResponse{
			Token: token,
		})
	}
}

func GenerateToken(data map[string]string) string {
	expirationTime := time.Now().Add(30 * 24 * time.Hour)
	issuedAt := time.Now().Unix()

	claims := jwt.MapClaims{
		"sub": data,
		"iat": issuedAt,
		"exp": expirationTime.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte("secret"))
	if err != nil {
		return ""
	}

	return tokenString
}

func GetMe() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		user := ctx.MustGet("user").(database.User)
		user.Password = ""
		ctx.JSON(http.StatusOK, user)
	}
}

type UpdateUserRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}

type UpdateUserResponse struct {
	Status  string        `json:"status"`
	Message string        `json:"message"`
	Data    database.User `json:"data"`
}

func UpdateUser(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var userReq UpdateUserRequest
		if err := ctx.ShouldBindJSON(&userReq); err != nil {
			ctx.JSON(http.StatusNotAcceptable, gin.H{
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

		user := ctx.MustGet("user").(database.User)
		if !user.IsVerified.Bool {
			ctx.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "User not verified",
			})
			return
		}

		uptUser, err := qtx.UpdateUser(ctx, database.UpdateUserParams{
			ID:           user.ID,
			FirstName:    userReq.FirstName,
			LastName:     userReq.LastName,
			Email:        userReq.Email,
			Phone:        user.Phone,
			AadharNumber: user.AadharNumber,
			IsVerified: sql.NullBool{
				Bool:  user.IsVerified.Bool,
				Valid: user.IsVerified.Valid,
			},
			Password: user.Password,
			Role:     user.Role,
		})
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "Error updating user",
			})
			return
		}
		tx.Commit()

		uptUser.Password = ""
		ctx.JSON(http.StatusOK, UpdateUserResponse{
			Status:  "success",
			Message: "User updated successfully",
			Data:    uptUser,
		})
	}
}

type ChangePasswordRequest struct {
	OldPassword     string `json:"oldPassword"`
	NewPassword     string `json:"newPassword"`
	ConfirmPassword string `json:"confirmPassword"`
}

type ChangePasswordResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func ChangePassword(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var userReq ChangePasswordRequest
		if err := ctx.ShouldBindJSON(&userReq); err != nil {
			ctx.JSON(http.StatusNotAcceptable, gin.H{
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

		user := ctx.MustGet("user").(database.User)
		if !user.IsVerified.Bool {
			ctx.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "User not verified",
			})
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userReq.OldPassword))
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"status":  "error",
				"message": "Invalid old password",
			})
			return
		}

		if userReq.NewPassword != userReq.ConfirmPassword {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "Password mismatch",
			})
			return
		}

		newHashedPassword, err := bcrypt.GenerateFromPassword([]byte(userReq.NewPassword), bcrypt.DefaultCost)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Error hashing password",
			})
			return
		}

		_, err = qtx.UpdateUser(ctx, database.UpdateUserParams{
			ID:           user.ID,
			FirstName:    user.FirstName,
			LastName:     user.LastName,
			Email:        user.Email,
			Phone:        user.Phone,
			AadharNumber: user.AadharNumber,
			IsVerified: sql.NullBool{
				Bool:  user.IsVerified.Bool,
				Valid: user.IsVerified.Valid,
			},
			Password: string(newHashedPassword),
			Role:     user.Role,
		})
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "Error updating password",
			})
			return
		}
		tx.Commit()

		ctx.JSON(http.StatusOK, ChangePasswordResponse{
			Status:  "success",
			Message: "Password updated successfully",
		})
	}
}

func GetUserByAadharNumber(queries *database.Queries, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		aadharNumber := ctx.Query("aadharNumber")
		if aadharNumber == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "Invalid Aadhar Number",
			})
			return
		}
		user, err := queries.GetUserByAadhar(ctx, aadharNumber)
		if err != nil {
			fmt.Println(err)
			ctx.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "User not found",
			})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data": gin.H{
				"id":        user.ID,
				"firstName": user.FirstName,
				"lastName":  user.LastName,
				"email":     user.Email,
				"avatar":    fmt.Sprintf("https://i.pravatar.cc/150?img=%d", user.ID),
			},
		})
	}
}
