import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";

/* ================= LOGIN ================= */

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3 className="text-center">Login</h3>
      <form onSubmit={handleLogin}>
        <input
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100">Login</button>
        <p className="text-center mt-2">
          New user? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

/* ================= REGISTER ================= */

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    alert(data.message);
    navigate("/login");
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3 className="text-center">Register</h3>
      <form onSubmit={handleRegister}>
        <input
          className="form-control mb-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
}

/* ================= DASHBOARD ================= */

function Dashboard() {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [profile, setProfile] = useState({});
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
    fetchTasks();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch("http://localhost:5000/api/user/profile", {
      headers: { authorization: token },
    });
    const data = await res.json();
    setProfile(data);
  };

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks", {
      headers: { authorization: token },
    });
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (!title) return;
    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    fetchTasks();
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
  };

  const updateTask = async () => {
    if (!editTitle) return;

    await fetch(`http://localhost:5000/api/tasks/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify({ title: editTitle }),
    });

    setEditId(null);
    setEditTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { authorization: token },
    });
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h4>Welcome, {profile.name}</h4>
        <button onClick={logout} className="btn btn-danger btn-sm">
          Logout
        </button>
      </div>

      <hr />

      {/* ===== CRUD INFO SECTION ===== */}
      <div className="card mb-4">
        <div className="card-body">
          <h6 className="mb-2">Dashboard Overview</h6>
          <p className="mb-2">
            This dashboard demonstrates CRUD operations on a sample entity called
            <strong> Tasks</strong>.
          </p>
          <ul className="mb-0">
            <li><strong>Create:</strong> Add a new task using the input field.</li>
            <li><strong>Read:</strong> View all your tasks in the list below.</li>
            <li><strong>Update:</strong> Edit a task using the Edit button.</li>
            <li><strong>Delete:</strong> Remove a task using the Delete button.</li>
          </ul>
        </div>
      </div>


      <h5>Add Task</h5>
      <div className="d-flex mb-3">
        <input
          className="form-control me-2"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTask} className="btn btn-primary">
          Add
        </button>
      </div>

      {editId && (
        <div className="mb-3">
          <h6>Edit Task</h6>

          <input
            className="form-control mb-2"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <button
            onClick={updateTask}
            className="btn btn-success me-2"
          >
            Update
          </button>

          <button
            onClick={() => {
              setEditId(null);
              setEditTitle("");
            }}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      )}

      <ul className="list-group">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {task.title}

            <div>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => startEdit(task)}
              >
                Edit
              </button>

              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================= ROUTES ================= */

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
