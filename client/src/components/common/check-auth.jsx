import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  if (
    !isAuthenticated &&
    !(path.includes("/login") || path.includes("/register"))
  ) {
    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    (path.includes("/login") || path.includes("/register"))
  ) {
    return user?.role === "admin" ? (
      <Navigate to="/Admin/dashboard" />
    ) : (
      <Navigate to="/shop/home" />
    );
  }

  // 3️⃣ Normal user trying to access admin route
  if (isAuthenticated && user?.role !== "admin" && path.includes("admin")) {
    return <Navigate to="/unauth-page" />;
  }

  // 4️⃣ Admin trying to access shop route
  if (isAuthenticated && user?.role === "admin" && path.includes("shop")) {
    return <Navigate to="/Admin/dashboard" />;
  }

  return <>{children}</>;
};

export default CheckAuth;
