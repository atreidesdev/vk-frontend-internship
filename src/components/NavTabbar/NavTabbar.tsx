import { Link, useLocation } from "react-router-dom";
import styles from "./NavTabbar.module.css";

const LINKS = [
  { to: "/", label: "Каталог" },
  { to: "/favorites", label: "Избранное" },
];

export function NavTabbar() {
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      {LINKS.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className={
            location.pathname === to ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
