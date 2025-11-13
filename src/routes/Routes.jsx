import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { SpinnerButton } from "../components/Spinner";

function ProtectedRoute({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🧠 Check if the user is logged in (has a session)
    const checkLogin = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }

      setLoading(false);
    };

    checkLogin();
  }, []);

  // ⏳ Show spinner while checking
  if (loading) {
    return (
      <p style={{ textAlign: "center" }}>
        <SpinnerButton />
      </p>
    );
  }

  //  Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, show the protected content (children)
  return children;
}

export default ProtectedRoute;
