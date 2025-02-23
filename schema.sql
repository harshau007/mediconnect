CREATE TABLE If NOT EXISTS hospital (
    id INTEGER PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255) NOT NULL,
    visiting_hours VARCHAR(255) NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    last_inspected TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    facilities VARCHAR(255) NOT NULL,
    queue_length INT NOT NULL,
    average_waiting_time INT NOT NULL,
    current_waiting_time INT NOT NULL,
    is_crowded BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE If NOT EXISTS user (
    id INTEGER PRIMARY KEY NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    aadhar_number VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE If NOT EXISTS otp (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL REFERENCES user(id) on DELETE CASCADE,
    otp_number VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE if NOT EXISTS appointments (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL REFERENCES user(id) on DELETE CASCADE,
    hospital_id INTEGER NOT NULL REFERENCES hospital(id) on DELETE CASCADE,
    hospital_name VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    appointment_time TIMESTAMP NOT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, hospital_id, appointment_date, appointment_time)
);