import { jwtDecode } from "jwt-decode";
import { type fetchWrapperParam, postApi } from "./fetchWrapper";
import { urlPaths } from "./urlPaths";

function isTokenExpired(token: string) {
  if (token === null || token === undefined) {
    return true;
  }
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; //current time in milliseconds
  if (!decodedToken || !decodedToken.exp) {
    return true;
  }
  //  console.log(
  //    "decodedToken in is token expired: ",
  //    decodedToken,
  //    "current in ms: ",
  //    currentTime,
  //  );
  const isTokenExpired = currentTime > decodedToken.exp;
  // console.log("is token expired: ", isTokenExpired);
  return isTokenExpired;
}

async function refreshAccessToken(refreshToken: string) {
  const url = urlPaths.tokenUrl.token_Refresh;
  //console.log("url in refreshToken: ", url);
  //console.log("refreshToken in refreshToken: ", refreshToken);
  const fetchParams: fetchWrapperParam = {
    url,
    opts: {
      body: { refreshToken: refreshToken },
    },
  };
  const responseData = postApi(fetchParams);
  return responseData;
}

export { isTokenExpired, refreshAccessToken };
