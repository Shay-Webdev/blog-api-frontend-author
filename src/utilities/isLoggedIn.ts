import { userInSession } from "./userInSession";

const isLoggedIn = async () => {
  const user = await userInSession();
  console.log(`user in is logged in :`, user);
  if (!user) {
    return false;
  }
  return true;
};

export default isLoggedIn;
