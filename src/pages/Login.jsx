import React from "react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { supabase } from "../lib/supabaseClient"
import { useState } from "react"


function Login() {

    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")
    const [loading , setLoading] = useState(false)
    const [message , setMessage] = useState("")


    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        const {data , error} = await supabase.auth.signInWithPassword({   // automatically hash password 
            email,
            password,
        })

        if(error) {
            setMessage(error.message)
        } else {
            setMessage("Login successful Redirecting ..... ")
            console.log("user" , data.user);
            
        }
        setLoading(false)
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <Input type="email" placeholder="Email" required value= {email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">
              {loading ? "Logging in ... " : "Log in "}
            </Button>
            {message && (
                 <p className="text-sm text-center text-gray-600 mt-2">
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
