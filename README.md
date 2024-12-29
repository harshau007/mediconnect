# MediConnect

MediConnect is a modern medical management platform designed to streamline healthcare processes for both users and hospitals. By leveraging a unified identity system (e.g., Aadhaar for Indian citizens), MediConnect provides secure access to medical history, medications, and nearby hospital information.

## Features

- **Unified Identity Integration**: Connects with Aadhaar for Indian citizens to provide a unified medical profile.
- **Medical History Tracking**: Stores and provides access to users' medical records and history.
- **Medication Management**: Tracks current and past prescriptions.
- **Hospital Locator**: Displays nearby hospitals and available services.
- **User-Friendly Interface**: Intuitive design with modern UI/UX principles.

## Tech Stack

### Backend

- **Language**: Go
- **Database**: SQLite
- **DB Communication**: SQLC (SQL Code Generation)

### Frontend

- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Library**: ShadCN

## Installation and Setup

### Prerequisites

- Go (v1.20 or later)
- Node.js (v18 or later) and npm
- SQLite

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/harshau007/mediconnect.git
   cd mediconnect/frontend
   ```
2. Build frontend

   ```bash
   npm install && npm run build
   ```

3. Install dependencies:

   ```bash
   go mod tidy # in root dir
   ```

4. Run the backend server:
   ```bash
   go run main.go
   ```

### Configuration

- Update the `.env` file in the backend directory with your configuration details.
- Ensure the backend API URL is correctly set in the frontend configuration.

## Development

- **Frontend**: Built with React, TypeScript, and TailwindCSS. Styled using ShadCN for a modern and consistent UI.
- **Backend**: Uses Go for efficient and robust server-side logic with SQLC for database interactions.

## Contribution

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License

MediConnect is licensed under the MIT License. See [LICENSE](LICENSE) for more details.
