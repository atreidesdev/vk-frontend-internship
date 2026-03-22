import { NavTabbar } from "@/components/NavTabbar";
import { AppRoutes } from "@/routes";
import styles from "./Layout.module.css";

export function Layout() {
  return (
    <div className={styles.layout}>
      <NavTabbar />
      <main className={styles.main}>
        <AppRoutes />
      </main>
    </div>
  );
}
