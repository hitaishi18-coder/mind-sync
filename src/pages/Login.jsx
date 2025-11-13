import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Login successful! Redirecting...");
      console.log("User logged in:", data.user);
      navigate("/dashboard");

    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-[400px] bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-gray-800">
            Welcome Back
          </CardTitle>
          <p className="text-center text-gray-500 text-sm mt-2">
            Log in to continue your journey with MindSync
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-2 focus:ring-blue-500"
            />
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-300  text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
            {message && (
              <p className="text-sm text-center text-gray-700 mt-3">{message}</p>
            )}
          </form>
          <p className="text-sm text-center mt-4 text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
