const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DB CONNECTION ================= */

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MG_@#3307",
  database: "task_manager",
});

db.connect((err) => {
  if (err) {
    console.log("Database error:", err);
  } else {
    console.log("MySQL connected");
  }
});

/* ================= JWT MIDDLEWARE ================= */

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ================= AUTH APIs (REST) ================= */

// Register
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const query =
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(query, [name, email, hashedPassword], (err) => {
    if (err) {
      return res.status(400).json({ message: "User already exists" });
    }
    res.json({ message: "User registered successfully" });
  });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], (err, result) => {
    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({ token });
  });
});

/* ================= USER PROFILE ================= */

app.get("/api/user/profile", authMiddleware, (req, res) => {
  const query = "SELECT id, name, email FROM users WHERE id = ?";

  db.query(query, [req.userId], (err, result) => {
    res.json(result[0]);
  });
});

/* ================= TASK CRUD APIs ================= */

// Get all tasks
app.get("/api/tasks", authMiddleware, (req, res) => {
  const query = "SELECT * FROM tasks WHERE user_id = ?";

  db.query(query, [req.userId], (err, result) => {
    res.json(result);
  });
});

// Add task
app.post("/api/tasks", authMiddleware, (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const query =
    "INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)";

  db.query(query, [title, description, req.userId], () => {
    res.json({ message: "Task added successfully" });
  });
});

// Update task
app.put("/api/tasks/:id", authMiddleware, (req, res) => {
  const { title, description } = req.body;

  const query =
    "UPDATE tasks SET title = ?, description = ? WHERE id = ? AND user_id = ?";

  db.query(
    query,
    [title, description, req.params.id, req.userId],
    () => {
      res.json({ message: "Task updated successfully" });
    }
  );
});

// Delete task
app.delete("/api/tasks/:id", authMiddleware, (req, res) => {
  const query = "DELETE FROM tasks WHERE id = ? AND user_id = ?";

  db.query(query, [req.params.id, req.userId], () => {
    res.json({ message: "Task deleted successfully" });
  });
});

/* ================= SERVER ================= */

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
