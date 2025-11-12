import React from "react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"


import { supabase } from "../lib/supabaseClient";
import { useState } from "react";

function Signup() {

    const [email , setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading , setLoading] = useState(false)
    const [message , setMessage] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

    const { data , error } = await supabase.auth.signUp({
            email,
            password,
        })

        if(error) {
            setMessage(error.message);
        } else {
            setMessage("Signup successful ! Please check your email to verify your account ..  ")
        }

        setLoading(false);
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required  />
            </div>
            <div>
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value) } required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              { loading ? "signup up ... " : "sign up "}
            </Button>
            { message && (
            <p className="text-sm text-center text-gray-600 mt-2">{message}</p>
            ) }
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Signup
