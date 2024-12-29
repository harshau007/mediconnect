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
