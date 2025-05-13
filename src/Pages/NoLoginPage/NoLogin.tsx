import styles from "./NoLogin.module.css";
import { Link, Outlet } from "react-router-dom";
const LoginOrSignup = () => {
  return (
    <div className={styles.loginorsignup_container}>
      <h1>Logged Out !</h1>
      <p>
        <Link to="login">Login</Link> or <Link to="signup">Sign up</Link> to
        continue
      </p>
    </div>
  );
};
const NoLogin = () => {
  return (
    <div className={styles.nologin_container}>
      <Outlet />
    </div>
  );
};

export { NoLogin, LoginOrSignup };
