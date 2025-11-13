import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { SpinnerButton } from "../components/SpinnerButton";



function ProtectedRoute({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();

      // Fake delay to visualize the spinner (remove later)
      await new Promise((res) => setTimeout(res, 2000));

      setIsLoggedIn(!!data.session);
      setLoading(false);
    };

    checkLogin();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3">
        <SpinnerButton/>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
