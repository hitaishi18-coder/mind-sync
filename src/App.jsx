import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar />

      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        <div className="flex-grow pt-20 px-4 pb-10">
          <Routes>
            {/* Direct access to Dashboard, redirecting root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Placeholder routes for structure */}
            <Route path="/about" element={<div className="text-center mt-20">About MindSync</div>} />
            <Route path="/contact" element={<div className="text-center mt-20">Contact Us</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;