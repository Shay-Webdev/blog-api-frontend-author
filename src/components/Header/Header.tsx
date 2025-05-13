import styles from "./Header.module.css";
import { MyNavLink } from "../../Pages/MyLink/MyLink";
function Header() {
  return (
    <header className={styles.header}>
      <h1>Blog maker - share your toughts!</h1>
      <nav className={styles.header_nav}>
        <MyNavLink To="/">Home</MyNavLink>
        <MyNavLink To="logout">Logout</MyNavLink>
        <MyNavLink To="posts">Make Blog</MyNavLink>
      </nav>
    </header>
  );
}

export { Header };
