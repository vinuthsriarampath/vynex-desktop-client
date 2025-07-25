import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";
import Loading from "@/pages/loading";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation(); 

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const authenticated = await isAuthenticated();
        setAuth(authenticated);
      } catch (error) {
        setAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [location.pathname]);

  if (isLoading) {
    return <Loading/>
  }

  if (!auth) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}