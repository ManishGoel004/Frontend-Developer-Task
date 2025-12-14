# Task Manager Dashboard – Frontend Developer Intern Assignment

This project is a simple full-stack web application built as part of a Frontend Developer Intern assignment.  
The goal was to demonstrate frontend skills along with basic backend integration, authentication, and CRUD operations.

---

## Tech Stack

### Frontend
- React.js
- Bootstrap
- Plain CSS
- React Router DOM

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication

---

## Features

### Authentication
- User registration
- User login
- JWT-based authentication
- Protected dashboard route
- Logout functionality

### Dashboard
- Displays authenticated user information (welcome message)
- CRUD operations on a sample entity (Tasks)
  - Create task
  - Read tasks
  - Update task
  - Delete task
- Tasks are user-specific (each user sees only their own tasks)

---

## Project Structure

### Backend (Single File – Simple Structure)
backend/
├── server.js
└── package.json

### Frontend (Minimal Structure)
frontend/
├── public/
└── src/
├── App.js
├── index.js
└── styles.css

The structure was intentionally kept simple since the project scope is small and focused on clarity.

---

## Database Schema

### Users Table
users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP
)
Tasks Table
sql
Copy code
tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200),
  user_id INT,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)

API Endpoints (REST)
Authentication
POST /api/auth/register – Register a user

POST /api/auth/login – Login user and get JWT

User
GET /api/user/profile – Fetch logged-in user profile

Tasks (Protected)
GET /api/tasks – Get all tasks of logged-in user

POST /api/tasks – Add a new task

PUT /api/tasks/:id – Update a task

DELETE /api/tasks/:id – Delete a task

How to Run the Project
Backend
bash
Copy code
cd backend
npm install
node server.js
Frontend
bash
Copy code
cd frontend
npm install
npm start
Frontend runs on: http://localhost:3000

Backend runs on: http://localhost:5000

Security Practices
Passwords are hashed using bcrypt

JWT is used for authentication

Protected routes using middleware

Users can only access their own data

Notes
The project focuses on functionality and clean integration rather than complex UI.

The structure can be easily scaled and modularized for production use.

---

# Scaling Note

##  How This Project Can Be Scaled for Production

If this project were to be scaled for production, the following improvements would be made:

### Backend Scaling
- Split the single server file into routes, controllers, and services
- Use environment variables for secrets and database credentials
- Add pagination for task listing
- Implement role-based access control if required
- Use connection pooling for MySQL
- Add request validation using libraries like Joi or Zod

### Frontend Scaling
- Break App.js into reusable components
- Introduce a state management solution if the app grows (Context API / Redux)
- Add better error handling and loading states
- Improve UI/UX and accessibility
- Use environment-based API URLs

### Deployment & Infrastructure
- Deploy backend using Docker and cloud services
- Use Nginx as a reverse proxy
- Enable HTTPS
- Add CI/CD pipelines
- Use cloud-managed databases

The current implementation is intentionally kept simple to match the assignment scope while ensuring it can be scaled easily.
