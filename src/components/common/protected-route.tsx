// components/ProtectedRoute.tsx
import { isAuthenticated } from "@/utils/auth";
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children}:{ children: React.ReactNode}) {
  if(!isAuthenticated){
   return <Navigate to="/" replace />;
  }  
  return <>{children}</>;

}
