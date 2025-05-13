import { jwtDecode } from "jwt-decode";
import { isTokenExpired, refreshAccessToken } from "./jwtTokens";
import { getLocalItem, setLocalItem } from "./localStorage";
import type { IJwtPayload } from "../types/types";

const userInSession = async () => {
  try {
    const refreshTokenInLS = getLocalItem("authorRefreshToken");
    //    console.log("refresh token in local storage: ", refreshTokenInLS);

    if (!refreshTokenInLS) {
      console.error(`No refrshToken in local storage`);
      return null;
    }
    const isrefreshTokenExpired = isTokenExpired(refreshTokenInLS);
    if (!refreshTokenInLS || isrefreshTokenExpired) {
      return null;
    }

    let accessTokenInLS = getLocalItem("authorAccessToken");

    const isAccessTokenExpired = isTokenExpired(accessTokenInLS);

    if (!accessTokenInLS || isAccessTokenExpired) {
      const refreshAccesstokenResponse =
        await refreshAccessToken(refreshTokenInLS);
      const newAccessToken = refreshAccesstokenResponse.data.token;
      //      console.log(`newAccessToken in session user: `, newAccessToken);
      setLocalItem("authorAccessToken", newAccessToken);
      accessTokenInLS = newAccessToken;
    }
    //   console.log("acces token in local storage: ", accessTokenInLS);
    const userInSession = jwtDecode(accessTokenInLS) as IJwtPayload;
    //console.log(`user in session user: `, userInSession);
    return { user: userInSession, accessToken: accessTokenInLS as string };
  } catch (error) {
    throw new Error(`Error parsing user in session: ${String(error)}`);
  }
};

export { userInSession };
