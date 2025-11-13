import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/Routes";
import Dashboard from "./pages/Dashboard"; //  You'll create this page next

function App() {
  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Routes>
          <Route path="/" element={<h1 className="text-2xl font-bold text-gray-700">Welcome to MindSync </h1>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/*  Protected Route Example */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
