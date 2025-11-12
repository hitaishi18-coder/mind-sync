import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        {/* Navigation */}
        <nav className="mb-6 flex gap-4">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1 className="text-2xl font-bold text-gray-700">Welcome to the App 🚀</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
