import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Routes>
          <Route path="/" element={<h1 className="text-2xl font-bold text-gray-700">hii</h1>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/*  Protected Route Example */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
