import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { supabase } from "../lib/supabaseClient";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Signup successful! Please check your email to verify your account.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center ">
      <Card className="w-[400px] bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-gray-800">
            Create Account
          </CardTitle>
          <p className="text-center text-gray-500 text-sm mt-2">
            Join MindSync to explore endless possibilities!
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSignup}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-2 focus:ring-indigo-400"
            />
            <Input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:ring-2 focus:ring-indigo-400"
            />
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
            {message && (
              <p className="text-sm text-center text-gray-700 mt-3">{message}</p>
            )}
          </form>
          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Log in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;
