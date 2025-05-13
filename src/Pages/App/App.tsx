import styles from "./App.module.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className={styles.app_container}>
      <Header></Header>
      <main className={styles.main_container}>
        <Outlet />
      </main>
      <Footer></Footer>
    </div>
  );
}

export default App;
