// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package database

import (
	"database/sql"
)

type Hospital struct {
	ID                 int64        `json:"id"`
	Name               string       `json:"name"`
	Address            string       `json:"address"`
	Phone              string       `json:"phone"`
	Email              string       `json:"email"`
	Website            string       `json:"website"`
	VisitingHours      string       `json:"visitingHours"`
	IsOpen             sql.NullBool `json:"isOpen"`
	LastInspected      sql.NullTime `json:"lastInspected"`
	IsVerified         sql.NullBool `json:"isVerified"`
	Facilities         string       `json:"facilities"`
	QueueLength        int64        `json:"queueLength"`
	AverageWaitingTime int64        `json:"averageWaitingTime"`
	CurrentWaitingTime int64        `json:"currentWaitingTime"`
	IsCrowded          sql.NullBool `json:"isCrowded"`
	CreatedAt          sql.NullTime `json:"createdAt"`
	UpdatedAt          sql.NullTime `json:"updatedAt"`
}

type Otp struct {
	ID        int64        `json:"id"`
	UserID    int64        `json:"userId"`
	OtpNumber string       `json:"otpNumber"`
	CreatedAt sql.NullTime `json:"createdAt"`
	UpdatedAt sql.NullTime `json:"updatedAt"`
}

type User struct {
	ID           int64        `json:"id"`
	FirstName    string       `json:"firstName"`
	LastName     string       `json:"lastName"`
	Phone        string       `json:"phone"`
	Email        string       `json:"email"`
	IsVerified   sql.NullBool `json:"isVerified"`
	AadharNumber string       `json:"aadharNumber"`
	Password     string       `json:"password"`
	Role         string       `json:"role"`
	CreatedAt    sql.NullTime `json:"createdAt"`
	UpdatedAt    sql.NullTime `json:"updatedAt"`
}
