import MainDrawer from "@/components/Drawer/MainDrawer";
import PersistentDrawerLeft from "@/components/Drawer/MainDrawer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>

      {/* <MainDrawer /> */}
      <PersistentDrawerLeft />

      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}