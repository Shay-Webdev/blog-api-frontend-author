import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  deleteApi,
  type fetchWrapperParam,
} from "../../utilities/fetchWrapper";
import { urlPaths } from "../../utilities/urlPaths";
import { deleteLocalItem } from "../../utilities/localStorage";
import { userInSession } from "../../utilities/userInSession";
import { LoadingPage } from "../LoadingPage/LoadingPage";
import isLoggedIn from "../../utilities/isLoggedIn";
const Logout = () => {
  const [isLogged, setIsLogged] = useState<
    "loading" | "loggedIn" | "loggedOut"
  >("loading");
  useEffect(() => {
    async function asyncHandler() {
      const logged = await isLoggedIn();
      console.log(`is logged in logout: `, logged);
      if (!logged) {
        setIsLogged("loggedOut");
        return;
      }
      setIsLogged("loggedIn");
    }
    asyncHandler();
  }, []);
  const navigate = useNavigate();
  const [status, setStatus] = useState<"done" | "pending">("pending");
  useEffect(() => {
    async function asyncHandler() {
      const user = await userInSession();
      const deleteParams: fetchWrapperParam = {
        url: urlPaths.sessionUrl.logout,
        opts: {
          headers: {
            authorization: `Bearer ${user?.accessToken}`,
          },
        },
      };
      const response = await deleteApi(deleteParams);
      if (response.status !== "success") {
        throw new Error(`logout failed`);
      }
      console.log(`logged out: `, response);
      const deletedRefreshToken = deleteLocalItem("authorRefreshToken");
      const deletedAccessToken = deleteLocalItem("authorAccessToken");
      console.log(
        `deleted tokens in local storage: `,
        deletedAccessToken,
        deletedRefreshToken,
      );
      setStatus("done");
      navigate("/", { replace: true });
    }
    asyncHandler();
  }, [navigate]);
  if (isLogged === "loggedOut") {
    console.log(`isLogged state: `, isLogged);
    return <Navigate to="/" />;
  }
  if (status === "pending") {
    return <LoadingPage />;
  }
  if (isLogged === "loading") {
    return <LoadingPage />;
  }
  return null;
};

export { Logout };
