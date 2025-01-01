// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: query.sql

package database

import (
	"context"
	"database/sql"
)

const createHospital = `-- name: CreateHospital :one
INSERT INTO hospital (
    name, address, phone, email, website, visiting_hours, is_open,
    facilities, queue_length, average_waiting_time, current_waiting_time,
    is_crowded
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
)
RETURNING id, name, address, phone, email, website, visiting_hours, is_open, last_inspected, facilities, queue_length, average_waiting_time, current_waiting_time, is_crowded, created_at, updated_at
`

type CreateHospitalParams struct {
	Name               string       `json:"name"`
	Address            string       `json:"address"`
	Phone              string       `json:"phone"`
	Email              string       `json:"email"`
	Website            string       `json:"website"`
	VisitingHours      string       `json:"visitingHours"`
	IsOpen             sql.NullBool `json:"isOpen"`
	Facilities         string       `json:"facilities"`
	QueueLength        int64        `json:"queueLength"`
	AverageWaitingTime int64        `json:"averageWaitingTime"`
	CurrentWaitingTime int64        `json:"currentWaitingTime"`
	IsCrowded          sql.NullBool `json:"isCrowded"`
}

func (q *Queries) CreateHospital(ctx context.Context, arg CreateHospitalParams) (Hospital, error) {
	row := q.db.QueryRowContext(ctx, createHospital,
		arg.Name,
		arg.Address,
		arg.Phone,
		arg.Email,
		arg.Website,
		arg.VisitingHours,
		arg.IsOpen,
		arg.Facilities,
		arg.QueueLength,
		arg.AverageWaitingTime,
		arg.CurrentWaitingTime,
		arg.IsCrowded,
	)
	var i Hospital
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Address,
		&i.Phone,
		&i.Email,
		&i.Website,
		&i.VisitingHours,
		&i.IsOpen,
		&i.LastInspected,
		&i.Facilities,
		&i.QueueLength,
		&i.AverageWaitingTime,
		&i.CurrentWaitingTime,
		&i.IsCrowded,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const createUser = `-- name: CreateUser :one
INSERT INTO user (
  first_name, last_name, phone, email, is_email_verified, aadhar_number, password, role
) VALUES (
  ?, ?, ?, ?, ?, ?, ?, ?
)
RETURNING id, first_name, last_name, phone, email, is_email_verified, aadhar_number, password, role, created_at, updated_at
`

type CreateUserParams struct {
	FirstName       string       `json:"firstName"`
	LastName        string       `json:"lastName"`
	Phone           string       `json:"phone"`
	Email           string       `json:"email"`
	IsEmailVerified sql.NullBool `json:"isEmailVerified"`
	AadharNumber    string       `json:"aadharNumber"`
	Password        string       `json:"password"`
	Role            string       `json:"role"`
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, createUser,
		arg.FirstName,
		arg.LastName,
		arg.Phone,
		arg.Email,
		arg.IsEmailVerified,
		arg.AadharNumber,
		arg.Password,
		arg.Role,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FirstName,
		&i.LastName,
		&i.Phone,
		&i.Email,
		&i.IsEmailVerified,
		&i.AadharNumber,
		&i.Password,
		&i.Role,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteHospital = `-- name: DeleteHospital :exec
DELETE FROM hospital
WHERE id = ?
`

func (q *Queries) DeleteHospital(ctx context.Context, id int64) error {
	_, err := q.db.ExecContext(ctx, deleteHospital, id)
	return err
}

const deleteUserByAadhar = `-- name: DeleteUserByAadhar :exec
DELETE FROM user
WHERE aadhar_number = ?
`

func (q *Queries) DeleteUserByAadhar(ctx context.Context, aadharNumber string) error {
	_, err := q.db.ExecContext(ctx, deleteUserByAadhar, aadharNumber)
	return err
}

const deleteUserByEmail = `-- name: DeleteUserByEmail :exec
DELETE FROM user
WHERE email = ?
`

func (q *Queries) DeleteUserByEmail(ctx context.Context, email string) error {
	_, err := q.db.ExecContext(ctx, deleteUserByEmail, email)
	return err
}

const deleteUserByID = `-- name: DeleteUserByID :exec
DELETE FROM user
WHERE id = ?
`

func (q *Queries) DeleteUserByID(ctx context.Context, id int64) error {
	_, err := q.db.ExecContext(ctx, deleteUserByID, id)
	return err
}

const deleteUserByPhone = `-- name: DeleteUserByPhone :exec
DELETE FROM user
WHERE phone = ?
`

func (q *Queries) DeleteUserByPhone(ctx context.Context, phone string) error {
	_, err := q.db.ExecContext(ctx, deleteUserByPhone, phone)
	return err
}

const getHospital = `-- name: GetHospital :one
SELECT id, name, address, phone, email, website, visiting_hours, is_open, last_inspected, facilities, queue_length, average_waiting_time, current_waiting_time, is_crowded, created_at, updated_at FROM hospital
WHERE id = ? LIMIT 1
`

func (q *Queries) GetHospital(ctx context.Context, id int64) (Hospital, error) {
	row := q.db.QueryRowContext(ctx, getHospital, id)
	var i Hospital
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Address,
		&i.Phone,
		&i.Email,
		&i.Website,
		&i.VisitingHours,
		&i.IsOpen,
		&i.LastInspected,
		&i.Facilities,
		&i.QueueLength,
		&i.AverageWaitingTime,
		&i.CurrentWaitingTime,
		&i.IsCrowded,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserByAadhar = `-- name: GetUserByAadhar :one
SELECT id, first_name, last_name, phone, email, is_email_verified, aadhar_number, password, role, created_at, updated_at FROM user
WHERE aadhar_number = ? LIMIT 1
`

func (q *Queries) GetUserByAadhar(ctx context.Context, aadharNumber string) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByAadhar, aadharNumber)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FirstName,
		&i.LastName,
		&i.Phone,
		&i.Email,
		&i.IsEmailVerified,
		&i.AadharNumber,
		&i.Password,
		&i.Role,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserByEmail = `-- name: GetUserByEmail :one
SELECT id, first_name, last_name, phone, email, is_email_verified, aadhar_number, password, role, created_at, updated_at FROM user
WHERE email = ? LIMIT 1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FirstName,
		&i.LastName,
		&i.Phone,
		&i.Email,
		&i.IsEmailVerified,
		&i.AadharNumber,
		&i.Password,
		&i.Role,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserByID = `-- name: GetUserByID :one
SELECT id, first_name, last_name, phone, email, is_email_verified, aadhar_number, password, role, created_at, updated_at FROM user
WHERE id = ? LIMIT 1
`

func (q *Queries) GetUserByID(ctx context.Context, id int64) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByID, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FirstName,
		&i.LastName,
		&i.Phone,
		&i.Email,
		&i.IsEmailVerified,
		&i.AadharNumber,
		&i.Password,
		&i.Role,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getUserByPhone = `-- name: GetUserByPhone :one
SELECT id, first_name, last_name, phone, email, is_email_verified, aadhar_number, password, role, created_at, updated_at FROM user
WHERE phone = ? LIMIT 1
`

func (q *Queries) GetUserByPhone(ctx context.Context, phone string) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByPhone, phone)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FirstName,
		&i.LastName,
		&i.Phone,
		&i.Email,
		&i.IsEmailVerified,
		&i.AadharNumber,
		&i.Password,
		&i.Role,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const listHospitals = `-- name: ListHospitals :many
SELECT id, name, address, phone, email, website, visiting_hours, is_open, last_inspected, facilities, queue_length, average_waiting_time, current_waiting_time, is_crowded, created_at, updated_at FROM hospital
WHERE (is_open = ? OR ? IS NULL)
  AND (average_waiting_time <= ? OR ? IS NULL)
  AND (current_waiting_time <= ? OR ? IS NULL)
  AND (queue_length <= ? OR ? IS NULL)
  AND (address LIKE '%' || ? || '%' OR ? IS NULL)
ORDER BY last_inspected DESC
`

type ListHospitalsParams struct {
	IsOpen             sql.NullBool   `json:"isOpen"`
	Column2            interface{}    `json:"column2"`
	AverageWaitingTime int64          `json:"averageWaitingTime"`
	Column4            interface{}    `json:"column4"`
	CurrentWaitingTime int64          `json:"currentWaitingTime"`
	Column6            interface{}    `json:"column6"`
	QueueLength        int64          `json:"queueLength"`
	Column8            interface{}    `json:"column8"`
	Column9            sql.NullString `json:"column9"`
	Column10           interface{}    `json:"column10"`
}

func (q *Queries) ListHospitals(ctx context.Context, arg ListHospitalsParams) ([]Hospital, error) {
	rows, err := q.db.QueryContext(ctx, listHospitals,
		arg.IsOpen,
		arg.Column2,
		arg.AverageWaitingTime,
		arg.Column4,
		arg.CurrentWaitingTime,
		arg.Column6,
		arg.QueueLength,
		arg.Column8,
		arg.Column9,
		arg.Column10,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Hospital
	for rows.Next() {
		var i Hospital
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Address,
			&i.Phone,
			&i.Email,
			&i.Website,
			&i.VisitingHours,
			&i.IsOpen,
			&i.LastInspected,
			&i.Facilities,
			&i.QueueLength,
			&i.AverageWaitingTime,
			&i.CurrentWaitingTime,
			&i.IsCrowded,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listUsers = `-- name: ListUsers :many
SELECT id, first_name, last_name, phone, email, is_email_verified, aadhar_number, password, role, created_at, updated_at FROM user
WHERE 
  (is_email_verified = ? OR ? = FALSE) AND
  (role = ? OR ? = FALSE)
ORDER BY updated_at DESC
`

type ListUsersParams struct {
	IsEmailVerified sql.NullBool `json:"isEmailVerified"`
	Column2         interface{}  `json:"column2"`
	Role            string       `json:"role"`
	Column4         interface{}  `json:"column4"`
}

func (q *Queries) ListUsers(ctx context.Context, arg ListUsersParams) ([]User, error) {
	rows, err := q.db.QueryContext(ctx, listUsers,
		arg.IsEmailVerified,
		arg.Column2,
		arg.Role,
		arg.Column4,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.ID,
			&i.FirstName,
			&i.LastName,
			&i.Phone,
			&i.Email,
			&i.IsEmailVerified,
			&i.AadharNumber,
			&i.Password,
			&i.Role,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateHospital = `-- name: UpdateHospital :one
UPDATE hospital
SET name = ?,
    address = ?,
    phone = ?,
    email = ?,
    website = ?,
    visiting_hours = ?,
    is_open = ?,
    facilities = ?,
    queue_length = ?,
    average_waiting_time = ?,
    current_waiting_time = ?,
    is_crowded = ?,
    last_inspected = ?
WHERE id = ?
RETURNING id, name, address, phone, email, website, visiting_hours, is_open, last_inspected, facilities, queue_length, average_waiting_time, current_waiting_time, is_crowded, created_at, updated_at
`

type UpdateHospitalParams struct {
	Name               string       `json:"name"`
	Address            string       `json:"address"`
	Phone              string       `json:"phone"`
	Email              string       `json:"email"`
	Website            string       `json:"website"`
	VisitingHours      string       `json:"visitingHours"`
	IsOpen             sql.NullBool `json:"isOpen"`
	Facilities         string       `json:"facilities"`
	QueueLength        int64        `json:"queueLength"`
	AverageWaitingTime int64        `json:"averageWaitingTime"`
	CurrentWaitingTime int64        `json:"currentWaitingTime"`
	IsCrowded          sql.NullBool `json:"isCrowded"`
	LastInspected      sql.NullTime `json:"lastInspected"`
	ID                 int64        `json:"id"`
}

func (q *Queries) UpdateHospital(ctx context.Context, arg UpdateHospitalParams) (Hospital, error) {
	row := q.db.QueryRowContext(ctx, updateHospital,
		arg.Name,
		arg.Address,
		arg.Phone,
		arg.Email,
		arg.Website,
		arg.VisitingHours,
		arg.IsOpen,
		arg.Facilities,
		arg.QueueLength,
		arg.AverageWaitingTime,
		arg.CurrentWaitingTime,
		arg.IsCrowded,
		arg.LastInspected,
		arg.ID,
	)
	var i Hospital
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Address,
		&i.Phone,
		&i.Email,
		&i.Website,
		&i.VisitingHours,
		&i.IsOpen,
		&i.LastInspected,
		&i.Facilities,
		&i.QueueLength,
		&i.AverageWaitingTime,
		&i.CurrentWaitingTime,
		&i.IsCrowded,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const updateHospitalInspection = `-- name: UpdateHospitalInspection :exec
UPDATE hospital
SET last_inspected = CURRENT_TIMESTAMP
WHERE id = ?
`

func (q *Queries) UpdateHospitalInspection(ctx context.Context, id int64) error {
	_, err := q.db.ExecContext(ctx, updateHospitalInspection, id)
	return err
}

const updateUser = `-- name: UpdateUser :one
UPDATE user
SET 
  first_name = ?,
  last_name = ?,
  phone = ?,
  email = ?,
  is_email_verified = ?, 
  aadhar_number = ?, 
  password = ?, 
  role = ?, 
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING id, first_name, last_name, phone, email, is_email_verified, aadhar_number, password, role, created_at, updated_at
`

type UpdateUserParams struct {
	FirstName       string       `json:"firstName"`
	LastName        string       `json:"lastName"`
	Phone           string       `json:"phone"`
	Email           string       `json:"email"`
	IsEmailVerified sql.NullBool `json:"isEmailVerified"`
	AadharNumber    string       `json:"aadharNumber"`
	Password        string       `json:"password"`
	Role            string       `json:"role"`
	ID              int64        `json:"id"`
}

func (q *Queries) UpdateUser(ctx context.Context, arg UpdateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, updateUser,
		arg.FirstName,
		arg.LastName,
		arg.Phone,
		arg.Email,
		arg.IsEmailVerified,
		arg.AadharNumber,
		arg.Password,
		arg.Role,
		arg.ID,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.FirstName,
		&i.LastName,
		&i.Phone,
		&i.Email,
		&i.IsEmailVerified,
		&i.AadharNumber,
		&i.Password,
		&i.Role,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const verifyUserEmail = `-- name: VerifyUserEmail :exec
UPDATE user
SET is_email_verified = TRUE, 
    updated_at = CURRENT_TIMESTAMP
WHERE email = ?
`

func (q *Queries) VerifyUserEmail(ctx context.Context, email string) error {
	_, err := q.db.ExecContext(ctx, verifyUserEmail, email)
	return err
}
