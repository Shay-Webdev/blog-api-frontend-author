import { useEffect, useState } from "react";
import { LoadingPage } from "../LoadingPage/LoadingPage";
import { Navigate, Outlet } from "react-router-dom";
import { userInSession } from "../../utilities/userInSession";

const ProtectedRoute = () => {
  const [status, setStatus] = useState<"loading" | "auth" | "noAuth">(
    "loading",
  );
  useEffect(() => {
    const asyncHanlder = async () => {
      const user = await userInSession();
      setStatus(user ? "auth" : "noAuth");
    };
    asyncHanlder();
  }, []);

  if (status === "loading") {
    return <LoadingPage />;
  }
  if (status === "noAuth") {
    return <Navigate to="/nologin" replace />;
  }
  if (status === "auth") {
    return <Outlet />;
  }
};

export { ProtectedRoute };
