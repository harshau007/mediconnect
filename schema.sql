CREATE TABLE If NOT EXISTS hospital (
    id INTEGER PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255) NOT NULL,
    visiting_hours VARCHAR(255) NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    last_inspected TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    facilities VARCHAR(255) NOT NULL,
    queue_length INT NOT NULL,
    average_waiting_time INT NOT NULL,
    current_waiting_time INT NOT NULL,
    is_crowded BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);