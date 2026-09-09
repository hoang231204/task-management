# Task Management API

A robust RESTful API for task management built with Node.js, Express, and MongoDB. This project provides endpoints for user authentication, managing tasks (CRUD operations), and user profile management.

## 🚀 Features

- **Authentication & Authorization:**
  - User registration and login using JWT (JSON Web Tokens).
  - Secure password hashing using `bcrypt`.
  - Forgot password / reset password workflow using `nodemailer`.
  - Route protection via authentication middleware.
  
- **Task Management (`/api/v1/tasks`):**
  - Create, Read, Update, and Delete (CRUD) tasks.
  - Search tasks by keyword.
  - Filter tasks by status.
  - Sort and paginate results for efficient data fetching.
  
- **User Management (`/api/v1/users`):**
  - View and manage user profiles.

## 🛠 Tech Stack

- **Backend Framework:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Email Service:** Nodemailer
- **Other Utilities:** CORS, body-parser, cookie-parser, dotenv

## 📂 Project Structure

```
├── api
│   └── v1
│       ├── controller/     # Contains business logic for routes
│       ├── middleware/     # Custom middleware (auth, etc.)
│       ├── model/          # Mongoose database schemas
│       ├── routes/         # Express route definitions
│       └── validation/     # Request validation logic
├── config/                 # Database configuration
├── helpers/                # Helper functions (search, pagination, etc.)
├── .env                    # Environment variables configuration
├── index.js                # Application entry point
└── package.json            # Project dependencies and scripts
```

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd task-management
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory and configure your environment variables. Refer to standard configurations like database URI, JWT secret, and email credentials.
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   # Add other required environment variables (e.g., for Nodemailer)
   ```

4. **Run the application:**
   For development (uses nodemon for hot-reloading):
   ```bash
   npm start
   ```
   The server will start on port `3000` by default (or the port specified in your `.env` file).

## 📡 API Endpoints

Base URL: `/api/v1`

- **Auth Routes:** `/api/v1/auth`
  - Login, Register, Forgot Password mechanisms.
- **Task Routes:** `/api/v1/tasks`
  - Get all tasks (supports `?keyword`, `?status`, `?sortBy`, `?sortType`, `?page`, `?limit`).
  - Create, update, delete, and manage task details.
- **User Routes:** `/api/v1/users`
  - User-specific operations and profile management.

## 📄 License

ISC License
