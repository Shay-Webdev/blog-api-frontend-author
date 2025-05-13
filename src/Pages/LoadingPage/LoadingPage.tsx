import LoadingComponent from "../../components/Loading/Loading";
import styles from "./LoadingPage.module.css";
const LoadingPage = () => {
  return (
    <section className={styles.loadingpage_container}>
      <LoadingComponent />
    </section>
  );
};

export { LoadingPage };
