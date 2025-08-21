# Squid Quiz

This is a full-stack web application that provides users with an immersive, two-level quiz game experience. The application is themed around the popular "Squid Game" series, incorporating video assets and a time-pressure environment to create a challenging and engaging quiz.

## Technologies Used

### Backend

*   **Framework:** Node.js with Express.js
*   **Database:** MongoDB (with Mongoose)
*   **Authentication:** Passport.js (local and Google OAuth)
*   **Session Management:** JSON Web Tokens (JWT)
*   **Email:** Nodemailer

### Frontend

*   **Framework:** React.js
*   **Styling:** Tailwind CSS

## Getting Started

### Prerequisites

*   Node.js and npm installed.
*   MongoDB installed and running.

### Installation and Running

**Backend**

1.  Navigate to the `Squid_B-main/Squid_B-main` directory.
2.  Install the dependencies:
    ```
    npm install
    ```
3.  Create a `.env` file in the root of the backend directory and add the following environment variables:
    ```
    PORT=3000
    MONGO_URI=<your_mongodb_uri>
    GMAIL_USER=<your_gmail_address>
    GMAIL_PASS=<your_gmail_password>
    ```
4.  Start the server:
    ```
    npm start
    ```

**Frontend**

1.  Navigate to the `Squid_F-main/Squid_F-main` directory.
2.  Install the dependencies:
    ```
    npm install
    ```
3.  Start the development server:
    ```
    npm start
    ```

## Folder Structure

```
Squid_Quiz-main/
├── Squid_B-main/         # Backend
│   └── Squid_B-main/
│       ├── config/
│       ├── src/
│       ├── index.js
│       └── server.js
└── Squid_F-main/         # Frontend
    └── Squid_F-main/
        ├── public/
        ├── src/
        └── App.jsx
```

## Detailed Report

A detailed report of the project can be found in [Squid_Quiz_Report_gemini.md](Squid_Quiz_Report_gemini.md).
