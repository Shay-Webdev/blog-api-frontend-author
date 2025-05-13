import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteApi,
  type fetchWrapperParam,
} from "../../utilities/fetchWrapper";
import { urlPaths } from "../../utilities/urlPaths";
import { deleteLocalItem } from "../../utilities/localStorage";
import { userInSession } from "../../utilities/userInSession";
import { LoadingPage } from "../LoadingPage/LoadingPage";
const Logout = () => {
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
      const deletedRefreshToken = deleteLocalItem("refreshToken");
      const deletedAccessToken = deleteLocalItem("accessToken");
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
  if (status === "pending") {
    return <LoadingPage />;
  }
  return null;
};

export { Logout };
