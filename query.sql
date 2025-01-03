-- name: GetHospital :one
SELECT * FROM hospital
WHERE id = ? LIMIT 1;

-- name: ListHospitals :many
SELECT * FROM hospital
WHERE (is_open = ? OR ? IS NULL)
  AND (average_waiting_time <= ? OR ? IS NULL)
  AND (current_waiting_time <= ? OR ? IS NULL)
  AND (queue_length <= ? OR ? IS NULL)
  AND (address LIKE '%' || ? || '%' OR ? IS NULL)
ORDER BY last_inspected DESC;

-- name: CreateHospital :one
INSERT INTO hospital (
    name, address, phone, email, website, visiting_hours, is_open,
    facilities, queue_length, average_waiting_time, current_waiting_time,
    is_crowded
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
)
RETURNING *;

-- name: UpdateHospital :one
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
RETURNING *;

-- name: DeleteHospital :exec
DELETE FROM hospital
WHERE id = ?;

-- name: UpdateHospitalInspection :exec
UPDATE hospital
SET last_inspected = CURRENT_TIMESTAMP
WHERE id = ?;

-- name: GetUserByID :one
SELECT * FROM user
WHERE id = ? LIMIT 1;

-- name: GetUserByEmail :one
SELECT * FROM user
WHERE email = ? LIMIT 1;

-- name: GetUserByPhone :one
SELECT * FROM user
WHERE phone = ? LIMIT 1;

-- name: GetUserByAadhar :one
SELECT * FROM user
WHERE aadhar_number = ? LIMIT 1;

-- name: ListUsers :many
SELECT * FROM user
WHERE 
  (is_verified = ? OR ? = FALSE) AND
  (role = ? OR ? = FALSE)
ORDER BY updated_at DESC;

-- name: CreateUser :one
INSERT INTO user (
  first_name, last_name, phone, email, is_verified, aadhar_number, password, role
) VALUES (
  ?, ?, ?, ?, ?, ?, ?, ?
)
RETURNING *;

-- name: UpdateUser :one
UPDATE user
SET 
  first_name = ?,
  last_name = ?,
  phone = ?,
  email = ?,
  is_verified = ?, 
  aadhar_number = ?, 
  password = ?, 
  role = ?, 
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: UpdateEmailVerified :one
UPDATE user
SET 
  is_verified = ?, 
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteUserByID :exec
DELETE FROM user
WHERE id = ?;

-- name: DeleteUserByEmail :exec
DELETE FROM user
WHERE email = ?;

-- name: DeleteUserByAadhar :exec
DELETE FROM user
WHERE aadhar_number = ?;

-- name: DeleteUserByPhone :exec
DELETE FROM user
WHERE phone = ?;

-- name: VerifyUserEmail :exec
UPDATE user
SET is_email_verified = TRUE, 
    updated_at = CURRENT_TIMESTAMP
WHERE email = ?;

-- name: CreateOTP :one
INSERT INTO otp (
    user_id,
    otp_number
) VALUES (
    ?, ?
)
RETURNING *;

-- name: GetOTPByID :one
SELECT * FROM otp
WHERE id = ?
LIMIT 1;

-- name: GetOTPByUserID :one
SELECT * FROM otp
WHERE user_id = ?
LIMIT 1;

-- name: ListOTPs :many
SELECT * FROM otp
ORDER BY created_at DESC;

-- name: UpdateOTP :one
UPDATE otp
SET
    otp_number = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteOTP :exec
DELETE FROM otp
WHERE id = ?;

-- name: DeleteOTPByUserID :exec
DELETE FROM otp
WHERE user_id = ?;
